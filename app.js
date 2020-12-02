//export const token = process.env['API_TOKEN']

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
    // let url = 'http://openlibrary.org/subjects/' + query + '.json?limit=100';
    let url = 'https://www.googleapis.com/books/v1/volumes?q=+subject:' + query + '&key=' + process.env.API_TOKEN;
    (async() => {
        try {
            const response = await got(url);
            console.log('statusCode:', response.statusCode);

            let data = JSON.parse(response.body);
            res.render('results', { book: getRandomBook(data) });
        } catch (error) {
            console.log('error:', error);
        }
    })();
})

function getRandomBook(data) {
    /* let max = data['works'].length + 1;
     let random = Math.floor(Math.random() * max);
     let book = {
         title: data['works'][random]['title'],
         authors: data['works'][random]['authors'],
         cover_id: data['works'][random]['cover_id']
     }
     console.log(data['works'][random]);

     console.log(book.authors[0]['name']);
     */
    let max = data['items'].length;
    let random = Math.floor(Math.random() * max);
    let book = {
        title: data['items'][random]['volumeInfo']['title'],
        authors: data['items'][random]['volumeInfo']['authors'],
        cover_id: data['items'][random]['volumeInfo']['imageLinks']['thumbnail']
    }
    console.log(data['items'][random]);

    //console.log(book.authors[0]['name']);
    return book;
};


app.listen(3000);