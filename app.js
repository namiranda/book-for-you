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
    //let query = 'flowers'
    let url = 'https://www.googleapis.com/books/v1/volumes?q=' + query + '&key=AIzaSyDJtSdf9wHATd58ma7SgT3lFGJybZcSCYI';
    (async() => {
        try {
            const response = await got(url);
            console.log('statusCode:', response.statusCode);


            let data = JSON.parse(response.body);
            res.render("results", { data: data });
            //res.send(results['Search'][0]['Title']);
            //res.send(data['items'][0]['volumeInfo']['title']);
        } catch (error) {
            console.log('error:', error);
        }
    })();
})

app.listen(3000);