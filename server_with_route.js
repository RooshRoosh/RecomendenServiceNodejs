var http = require('http'),
    template = require('swig'),
    pg = require('pg'),
    express = require('express'),
    cookieParser = require('cookie-parser'),  // npm install cookie-parser
    bodyParser = require('body-parser'), // npm install body-parser
    debug = require('debug')('todo-node-postgres:server'),
    querystring = require('querystring');

var router = express.Router();

var urlencodedParser = bodyParser.urlencoded({ extended: false })
var connectionString = "postgres://postgres:postgres@localhost:5432/ai_recipe";


router.get('/', function(req, res) {

    var tmpl = template.compileFile('./templates/index.html'),
        film_list = [],
        username = getUsernameFromCookie(req);

    if (!username){
        res.redirect('/login');
    }

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({success: false, data: err});
        }

        // SQL Query > Select Data

        var user_query = client.query(
            "select *  from users as u "+
            "where u.name='"+username+"'"
        )

        user_query.on('row', function(row){
           user_id = row['id'];
           var query = client.query(
                'SELECT * FROM movie as m ' +
                'LEFT JOIN likes as l ON l.movie_id = m.id and l.user_id=' + user_id
           );
           query.on('row', function(row) {
                film_list.push(row);
            });
           query.on('end',function(){
                return res.end(
                    tmpl(
                        {
                            'film_list': film_list,
                            'title': 'Кино для всех',
                            'username': username
                        }
                    )
                )
           })
        })
        user_query.on('end', function(){
           client.end()
        })
    });

});

router.get('/film/:film_id', function(req, res){

      var id = req.params.film_id,
      film_list = [],
      tmpl = template.compileFile('./templates/film_details.html');


      pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({success: false, data: err});
        }

        // SQL Query > Select Data

        var query = client.query(
//        "SELECT * FROM movie WHERE id=" + id
        'SELECT m.id, m.title, m.year, m.rank, m.poster, ARRAY_TO_JSON(ARRAY_AGG(m2.*)) as sim_movies ' +
        'FROM movie as m '+
        'JOIN movie_distance AS md ON md.movie1_id = m.id '+ // AND m1.l1 >0
        'JOIN movie AS m2 ON md.movie2_id = m2.id AND m2.id!=m.id '+
        'WHERE m.id =' + id +
        ' GROUP BY m.id;'
        );

        // Stream results back one row at a time
        query.on('row', function(row) {

            return res.end(
                tmpl(
                    {
                        'film': row,
                        'username': getUsernameFromCookie(req)
                    }
                )
            )
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end()

        });

    });

})

router.get('/logout', function(req, res){
    res.clearCookie('username');
    res.redirect('/');
    // Убираем куку
})

router.get('/login', function(req, res){
    // Рендерим страницу для авторизации
    var tmpl = template.compileFile('./templates/login.html')
    return res.end(
        tmpl({})
    )
})

router.post('/login', urlencodedParser, function(req, res){  // 3 параметра!
    // Вторым параметром передаём паресер параметров запроса
    var name = unescape(req.body['username']) || null
    if (name){
    // Ставим куку, добавляем пользователя в базу если его там нет

        pg.connect(connectionString, function(err, client, done) {
            var query = client.query(
                "INSERT INTO users (name) VALUES ('"+name+"') "+
                "ON CONFLICT ON CONSTRAINT name_unique DO NOTHING;"
            )

            query.on('end', function(){

                client.end()
                res.cookie('username', name, { maxAge: 900000 });
                res.redirect('/');
            })
        })

    } else {
        res.redirect('/login');
    }
})


router.get('/users/', function(req, res){
    user_list = [],
    tmpl = template.compileFile('./templates/user_list.html');


    pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM users");

        // Stream results back one row at a time
        query.on('row', function(row) {

            user_list.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {

            client.end()
            return res.end(
                tmpl(
                    {
                        'user_list': user_list,
                        'username': getUsernameFromCookie(req)
                    }
                )
            )
        });

    });
})

router.get('/users/:user_id', function(req, res){

      var id = req.params.user_id,
      film_list = [],
      tmpl = template.compileFile('./templates/user_details.html');


      pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query(
        "SELECT * FROM users AS u JOIN likes AS l ON l.user_id = u.id JOIN movie AS m ON m.id=l.movie_id WHERE u.id =" + id
        );

        // Stream results back one row at a time
        query.on('row', function(row) {
            film_list.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {

            return res.end(
                tmpl(
                    {
                        'film_list': film_list,
                        'target_user': film_list[0]['name'],
                        'username': getUsernameFromCookie(req)
                    }
                )
            )
            client.end()

        });

    });

})


router.get('/recommendation/users/', function(req, res){

    var user_list = [],
    username = getUsernameFromCookie(req)

    tmpl = template.compileFile('./templates/recommendation_user.html');

    pg.connect(connectionString, function(err, client, done) {

     var query = client.query(
        "select *  from users as u " +
        "join user_distance as ud ON u.id = ud.user1_id " +
        "join users as rec_user ON ud.user2_id = rec_user.id " +
        "where l1 <> 0 and u.name='"+ username +
        "' order by l2 DESC;"
    );

    query.on('row', function(row) {
        user_list.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
        return res.end(
            tmpl(
                {
                    'user_list': user_list,
                    'username': getUsernameFromCookie(req)
                }
            )
        )
        client.end()

    });

    })

})

router.post('/like', urlencodedParser, function(req, res){
   var user = getUsernameFromCookie(req)
   if (user){
       var movie_id = unescape(req.body['id']) || null,
           value = unescape(req.body['value']) || null;


       pg.connect(connectionString, function(err, client, done) {

           var user_query = client.query(
            "select *  from users as u "+
            "where u.name='"+user+"'"
           )


           console.log(1)


           user_query.on('row', function(row){
               user_id = row['id'];

               var query = client.query(
                   "INSERT INTO likes (user_id, movie_id, rating) VALUES ("+user_id+","+movie_id+","+value+") "+
                   "ON CONFLICT ON CONSTRAINT likes_pkey DO UPDATE " +
                   "SET rating="+value+" "+
                   "WHERE likes.user_id="+user_id+" AND "+" likes.movie_id="+movie_id
               )
               query.on('end',function(){
                    return res.end(
                        'done!'
                    )
               })
           })
           user_query.on('end', function(){
               client.end()
           })
       })
   } else{
        return res.end('error!')
   }
})


var port = 8000,
    app = express();

app.set('port', port)
app.use('/', router)
app.use(cookieParser())
app.use(bodyParser.json());

var server = new http.createServer(app)
server.listen(port, '127.0.0.1');

server.on('error', onError);
server.on('listening', onListening);


function getUsernameFromCookie(req){
    if (!req.headers.cookie){return null}
    var cookies = req.headers.cookie.split('&').map(function(e){return e.split('=')})
    for (var i=0; i<cookies.length;i++){
        if (cookies[i][0] == 'username'){
            return querystring.unescape(cookies[i][1])
        }
    }
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}






