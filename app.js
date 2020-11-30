const express = require('express'),
    bodyParser = require('body-parser'),
    got = require('got');

const app = express();

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
    //let url = 'http://openlibrary.org/search.json?q=' + query + '';
    let url = 'http://openlibrary.org/subjects/' + query + '.json?limit=100';
    (async() => {
        try {
            const response = await got(url);
            console.log('statusCode:', response.statusCode);

            let data = JSON.parse(response.body);
            res.render('results', { book: getRandom(data) });
        } catch (error) {
            console.log('error:', error);
        }
    })();
})

function getRandom(data) {
    let max = data['works'].length + 1;
    let random = Math.floor(Math.random() * max);
    let book = {
        title: data['works'][random]['title'],
        authors: data['works'][random]['authors'],
        cover_id: data['works'][random]['cover_id']
    }
    console.log(data['works'][random]);

    console.log(book.authors[0]['name']);

    return book;
};


app.listen(3000);