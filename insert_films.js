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
    },
    {
        "title":"Зеленая миля",
        "year":1999,
        "rank": 8.5,
        "poster":"http://st.kp.yandex.net/images/film_iphone/iphone360_435.jpg"
    },
{
    "title":"1+1",
    "year": 2011,
    "poster":"http://st.kp.yandex.net/images/film_iphone/iphone360_535341.jpg",
    "rank": 8.8
},
{
    "title":"Жизнь прекрасна",
    "year": 1997,
    "poster":"http://www.kinopoisk.ru/images/film_big/381.jpg",
    "rank": 8.6
},
{
    "title":"Иван Васильевич меняет профессию",
    "year": 1973,
    "poster":"http://st.kp.yandex.net/images/film_iphone/iphone360_42664.jpg",
    "rank": 8.7
},
{
    "title":"Достучаться до небес",
    "year": 1997,
    "poster":"http://st.kp.yandex.net/images/film_iphone/iphone360_32898.jpg",
    "rank": 8.6
},
{
    "title": "Интерстеллар",
    "year": 2014,
    "poster":"http://st.kp.yandex.net/images/film_iphone/iphone360_258687.jpg",
    "rank": 8.6
},
{
    "title":"Престиж",
    "year": 2006,
    "poster":"http://st.kp.yandex.net/images/film_iphone/iphone360_195334.jpg",
    "rank": 8.5
},
{
    "title":"Игры разума",
    "year": 2001,
    "poster":"http://www.kinopoisk.ru/images/film_big/530.jpg",
    "rank": 8.5
},
{
    "title":"Операция «Ы» и другие приключения Шурика",
    "year": 1965,
    "poster":"http://www.kinopoisk.ru/images/film_big/42782.jpg",
    "rank": 8.7
},
{
    "title":"Гладиатор",
    "year": 2000,
    "poster":"http://st.kp.yandex.net/images/film_iphone/iphone360_474.jpg",
    "rank": 8.6
},
{
    "title":"Назад в будущее",
    "year": 1985,
    "poster":"http://st.kp.yandex.net/images/film_iphone/iphone360_476.jpg",
    "rank": 8.6
},
{
    "title": "Карты, деньги, два ствола",
    "year": 1998,
    "poster": "http://st.kp.yandex.net/images/film_iphone/iphone360_522.jpg",
    "rank": 8.5
},
{
    "title":"Зверополис",
    "year": 2016,
    "poster":"http://st.kp.yandex.net/images/film_iphone/iphone360_775276.jpg",
    "rank": 8.6
},
{
    "title":"Пианист",
    "year": 2002,
    "poster":"http://st.kp.yandex.net/images/film_iphone/iphone360_355.jpg",
    "rank": 8.4
},
{
    "title":"Поймай меня, если сможешь",
    "year": 2002,
    "poster":"http://st.kp.yandex.net/images/film_iphone/iphone360_324.jpg",
    "rank": 8.5
},
{
    "title":"В бой идут одни «старики»",
    "year": 1973,
    "poster":"http://st.kp.yandex.net/images/film_iphone/iphone360_25108.jpg",
    "rank": 8.7
},
{
    "title":"Властелин колец: Братство кольца",
    "year": 2001,
    "poster":"http://st.kp.yandex.net/images/film_iphone/iphone360_328.jpg",
    "rank": 8.5
},
{
    "title":"Отступники",
    "year": 2006,
    "poster":"http://st.kp.yandex.net/images/film_iphone/iphone360_81314.jpg",
    "rank": 8.4
},
{
    "title":"Бриллиантовая рука",
    "year": 1968,
    "poster":"http://st.kp.yandex.net/images/film_iphone/iphone360_46225.jpg",
    "rank": 8.6
},
{
    "title":"Властелин колец: Две крепости",
    "year": 2002,
    "poster":"http://st.kp.yandex.net/images/film_iphone/iphone360_312.jpg",
    "rank": 8.5
},
{
    "title":"Американская история Х",
    "year": 1998,
    "poster":"http://st.kp.yandex.net/images/film_iphone/iphone360_382.jpg",
    "rank": 8.4
},
{
    "title":"Большой куш",
    "year": 2000,
    "poster":"http://st.kp.yandex.net/images/film_iphone/iphone360_526.jpg",
    "rank": 8.5
},
{
    "title":"Остров проклятых",
    "year": 2009,
    "poster":"http://st.kp.yandex.net/images/film_iphone/iphone360_397667.jpg",
    "rank": 8.5
},
{
    "title": "Пробуждение",
    "poster":"http://www.kinopoisk.ru/images/film_big/2950.jpg",
    "year": 1990,
    "rank": 8.4
},
{
    "title":"Пираты Карибского моря: Проклятие Черной жемчужины",
    "year": 2003,
    "poster":"http://st.kp.yandex.net/images/film_iphone/iphone360_4374.jpg",
    "rank": 8.3
},
{
    "title":"Хористы",
    "year": 2004,
    "poster":"http://st.kp.yandex.net/images/film_iphone/iphone360_51481.jpg",
    "rank": 8.3
},
{
    "title":"Джентльмены удачи",
    "year": 1971,
    "poster":"http://www.kinopoisk.ru/images/film_big/44386.jpg",
    "rank": 8.6
},
{
    "title":"Дубровский",
    "year": 2014,
    "rank": 5.763,
    "poster":"http://right-film.ru/uploads/posts/2016-02/1456157180-1824291676.jpg",
    "director":"Александр Вартанов"
},
{
    "title":"Про Любовь",
    "poster":"http://drufilms.ru/uploads/posts/2015-12/1450534383-2032288180.jpg",
    "director":"Анна Меликян",
    "year": 2015,
    "rank": 6.559
},
{
    "title":"Король Лев",
    "poster":"http://ru2.anyfad.com/items/t2@c60a98bb-6f13-4f16-b238-1c9c1c8b07e4/Korol-Lev-1994.jpg",
    "director":"Роджер Аллерс",
    "year": 1994,
    "rank": 8.8,
},
{
    "title":"Приключения Паддингтона",
    "poster":"http://kinogo-net-2015.ru/uploads/posts/2015-01/1421601585_priklyucheniya-paddingtona.jpg",
    "director":"Пол Кинг",
    "year": 2014,
    "rank": 7.2,
},
{
    "title":"Гарри Поттер и Дары Смерти",
    "poster":"http://kino-go.tv/uploads/posts/2015-07/1437691322_poster-407636.jpg",
    "director":"Дэвид Йэтс",
    "year": 2010,
    "rank": 7.8
},
{
    "title":"Хроники Нарнии: Покоритель Зари",
    "poster":"http://kino-go.tv/uploads/posts/2015-09/1441656442_poster-281439.jpg",
     "director":"Майкл Аптед",
     "year":2010,
     "rank": 6.9
}
]

var insert_values = []

for (var i=0;i<film_list.length; i++){
    var film_query = '('+
    "'"+film_list[i]['title']+"',"+
    ""+film_list[i]['year']+","+
    ""+film_list[i]['rank']+","+
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
    client.query("INSERT INTO movie(title, year, rank, poster) values " + insert_values.join(', '));
    for (var movie_id=1;i<=film_list.lenght;i++){
        for (var user_id=1; j<=5; j++){
            if (math.random()>0.56){
                client.query("INSERT INTO likes(user_id, movie_id) values "+"("+user_id+','+movie_id+")";
            }
        }
    }
    // SQL Query > Select Data
    var cursor = client.query("SELECT * FROM likes ORDER BY id ASC");
//
//    // Stream results back one row at a time
    cursor.on('row', function(row) {
        results.push(row);
    });
//
    // After all data is returned, close connection and return results
    cursor.on('end', function() {
        console.log(results)
    });
})



