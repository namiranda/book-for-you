const express = require('express'),
    bodyParser = require('body-parser'),
    got = require('got');

const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('landing');
})

app.get('/search', function(req, res) {
    res.render('search');
})

app.get('/results', function(req, res) {
    let query = req.query.search;
    console.log(query);
    let url = 'https://www.googleapis.com/books/v1/volumes?q=+subject:' + query + '&key=' + process.env.API_TOKEN;
    (async() => {
        try {
            const response = await got(url);
            console.log('statusCode:', response.statusCode);

            let data = JSON.parse(response.body);
            if (typeof data['items'] === 'undefined') { //Si la API no devuelve una lista vacia
                res.send('Try again');

            }
            res.render('results', { book: getRandomBook(data) });

        } catch (error) {
            console.log('error:', error);
        }
    })();
})

/**
 * Devuelve un objeto book, que contiene la informacion del libro seleccionado aleatoriamente
 * @param {JSON} data 
 */
function getRandomBook(data) {
    let max = data['items'].length;
    let random = Math.floor(Math.random() * max);
    let book = {
        title: data['items'][random]['volumeInfo']['title'],
        authors: data['items'][random]['volumeInfo']['authors'],
        description: data['items'][random]['volumeInfo']['description'],
        cover_url: formattedCover(data['items'][random]['volumeInfo']['imageLinks']['thumbnail'])
    }
    console.log(data['items'][random]);
    console.log(book.cover_url);
    return book;
};

/**
 * Devuelve un link a una imagen de portada de mayor tamaño, en caso de estar disponible
 * Ademas cambia http por https
 * @param {String} url 
 */
function formattedCover(url) {
    let index = url.indexOf('zoom=1');
    let start = url.slice(url.indexOf('//books'), index);
    let end = url.slice(url.indexOf('&edge'));
    let newUrl = 'https:' + start + 'zoom=50' + end;

    return newUrl;
}

app.listen(process.env.PORT);