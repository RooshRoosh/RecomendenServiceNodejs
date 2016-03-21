var http = require('http'),
template = require('swig');
pg = require('pg')

var server = new http.Server(),
    connectionString = "postgres://postgres:postgres@localhost:5432/ai_recipe";

server.listen(8880, '127.0.0.1');

server.on('request', function(req, res){

    var tmpl = template.compileFile('./templates/index.html'),
        film_list = [];

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM film ORDER BY id DESC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            film_list.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
//            done();
            client.end()
            return res.end(
                tmpl(
                    {
                        'film_list': film_list,
                        'title': 'Кино для всех'
                    }
                )
            )
        });

    });

    }
)