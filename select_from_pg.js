var pg = require('pg'),
    http = require('http'),
    template = require('swig');


var server = new http.Server(),
    connectionString = "postgres://postgres:postgres@localhost:5432/ai_recipe";


server.listen(8000, '127.0.0.1');


server.on('request', function(req, res){


    var tmpl = template.compileFile('./templates/1.html'),
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


//        console.log(new_results)

        query.on('end', function() {

            var row_length = 4,
            new_results =[]
    //        console.log(film_list)
            for (var i=0; i<=3; i++){
                new_results.push(film_list[i])
            }
//            done();
            client.end()
            return res.end(
                tmpl(
                    {
                        'film_list': [
                            new_results,
                            new_results,
                            new_results,
                            new_results,
                            new_results,
                        ],
                        'title': 'Кино для всех'
                    }
                )
            )
        });

    });

    }
)

function reshape(film_list){

    var row_length = 4,
        results = [],
        row = [];

    for (var i=0; i<film_list.length; i++){
        row.push(film_list[i])

        if (((i+1) % row_length)==0){
            results.push(row)
            row = []
        }
    }
    console.log(results)
    return results
}