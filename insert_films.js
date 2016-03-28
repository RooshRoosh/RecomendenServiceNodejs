pg = require('pg')


var connectionString =  "postgres://postgres:postgres@localhost:5432/ai_recipe";

//  "postgres://username:password@host:5432/db_name"

//  "postgres://postgres:postgres@localhost:5432/market";

// Get a Postgres client from the connection pool

film_list = [
    {
        'id': 1,
        'title':'Побег из Шоушенка',
        'year': 1994,
        'rank': 9.2,
        'position': 1,
        'poster': 'http://st-im.kinopoisk.ru/im/poster/1/4/7/kinopoisk.ru-The-Shawshank-Redemption-1479180.jpg'
    },
    {
        'id': 2,
        'title':'Крёстный отец',
        'year': 1972,
        'rank': 9.2,
        'position': 2,
        'poster': 'http://www.kinopoisk.ru/images/film_big/325.jpg'
    },
    {
        'id': 3,
        'title': 'Крёстный отец 2',
        'year': 1974,
        'rank': 9.0,
        'position': 3,
        'poster': 'http://www.kinopoisk.ru/images/film_big/327.jpg'
    },
    {
        'id': 4,
        'title': 'Тёмный рыцарь',
        'year': 2008,
        'rank': 8.9,
        'position': 4,
        'poster': 'http://www.kinopoisk.ru/images/film_big/111543.jpg'
    },
    {
        'id': 5,
        'title': 'Список Шиндлера',
        'year': 1993,
        'rank': 8.9,
        'position': 5,
        'poster': 'http://www.kinopoisk.ru/images/film_big/329.jpg'
    },
    {
        'id': 6,
        'title': 'Криминальное чтиво',
        'year': 1994,
        'rank': 8.9,
        'position': 6,
        'poster': 'http://www.kinopoisk.ru/images/film_big/342.jpg'
    },
    {
        'id': 7,
        'title': '12',
        'year': 2007,
        'rank': 7.6,
        'position': null,
        'poster': 'http://www.kinopoisk.ru/images/film_big/222809.jpg'
    },

    {
        'id': 8,
        'title': 'Властелин колец: Возвращение короля',
        'year': 2003,
        'rank': 8.9,
        'position': 8,
        'poster': 'http://st-im.kinopoisk.ru/im/poster/8/1/7/kinopoisk.ru-The-Lord-of-the-Rings_3A-The-Return-of-the-King-817079.jpg'
    },
    {
        'id': 9,
        'title': 'Бойцовский клуб',
        'year': 1999,
        'rank': 8.8,
        'position': 10,
        'poster': 'http://st-im.kinopoisk.ru/im/poster/1/8/0/kinopoisk.ru-Fight-Club-1801683.jpg'
    },
    {
        'id': 10,
        'title': 'Начало',
        'year': 2010,
        'rank': 8.7,
        'position': 14,

        'poster': 'http://st-im.kinopoisk.ru/im/poster/1/3/0/kinopoisk.ru-Inception-1302163.jpg'
    },
    {
        'id': 11,
        'title': 'Пролетая над гнездом кукушки',
        'year': 1975,
        'rank': 8.7,
        'position': 16,
        'poster': 'http://www.kinopoisk.ru/images/film_big/336.jpg'
    },
    {
        'id': 12,
        'title': 'Славные парни',
        'year': 1990,
        'rank': 8.7,
        'position': 17,
        'poster': 'http://www.kinopoisk.ru/images/film_big/350.jpg'
    },
    {
        'id': 13,
        'title': 'Матрица',
        'year': 1999,
        'rank': 8.7,
        'position': 18,
        'poster': 'http://www.kinopoisk.ru/images/film_big/301.jpg'
    },
    {
        'id': 14,
        'title': 'Леон',
        'year': 1994,
        'rank': 8.6,
        'position': 27,
        'poster': 'http://st-im.kinopoisk.ru/im/poster/1/7/8/kinopoisk.ru-L_26_23233_3Bon-1784007.jpg'
    },
    {
        'id': 15,
        'title': 'Унесённые призраками',
        'year': 2001,
        'rank': 8.5,
        'position': 29,
        'poster': 'http://www.kinopoisk.ru/images/film_big/370.jpg'
    }
]

var insert_values = []

for (var i=0;i<film_list.length; i++){
    var film_query = '('+film_list[i]['id']+","+
    "'"+film_list[i]['title']+"',"+
    ""+film_list[i]['year']+","+
    ""+film_list[i]['rank']+","+
    ""+film_list[i]['position']+","+
    "'"+film_list[i]['poster']+"')"
    insert_values.push(film_query)
}


var results = [];

pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log({ success: false, data: err});
    }

    // SQL Query > Insert Data
    for (var i=1; i<film_list.length; i++){
        var title = film_list[i]['title']
        var poster = film_list[i]['poster']
        client.query(addFilm(title, poster));
    }

    // SQL Query > Select Data
    var cursor = client.query("SELECT * FROM film ORDER BY id ASC");
//
//    // Stream results back one row at a time
    cursor.on('row', function(row) {
        results.push(row);
    });
//
    // After all data is returned, close connection and return results
    cursor.on('end', function() {
        console.log(results)
        client.close()
    });
})



