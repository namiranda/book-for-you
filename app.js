const express = require("express"),
    bodyParser = require("body-parser"),
    got = require("got"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

const User = require("./models/user");

const app = express();
const dotenv = require("dotenv");
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

mongoose.connect(process.env.DB_TOKEN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

//Passport config
app.use(
    require("express-session")({
        secret: "The cake is a lie",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
})

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/login");
        });
    });
});

app.get('/login', function(req, res) {
    res.render('login');
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/search',
    failureRedirect: '/login'
}), function(req, res) {})

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
})

app.get("/search", function(req, res) {
    res.render("search");
});

app.get("/results", function(req, res) {
    let query = req.query.search;
    console.log(query);
    let url =
        "https://www.googleapis.com/books/v1/volumes?q=+subject:" +
        query +
        "&key=" +
        process.env.API_TOKEN;
    (async() => {
        try {
            const response = await got(url);
            console.log("statusCode:", response.statusCode);

            let data = JSON.parse(response.body);
            if (typeof data["items"] === "undefined") {
                //Si la API no devuelve una lista vacia
                res.render("error");
            } else {
                res.render("results", { book: getRandomBook(data) });
            }
        } catch (error) {
            console.log("error:", error);
        }
    })();
});

/**
 * Devuelve un objeto book, que contiene la informacion del libro seleccionado aleatoriamente
 * @param {JSON} data
 */
function getRandomBook(data) {
    let max = data["items"].length;
    let random = Math.floor(Math.random() * max);
    let book = {
        title: data["items"][random]["volumeInfo"]["title"],
        authors: data["items"][random]["volumeInfo"]["authors"],
        description: data["items"][random]["volumeInfo"]["description"],
        cover_url: formattedCover(
            data["items"][random]["volumeInfo"]["imageLinks"]["thumbnail"]
        ),
    };
    console.log(data["items"][random]);
    console.log(book.cover_url);
    return book;
}

/**
 * Devuelve un link a una imagen de portada de mayor tamaño, en caso de estar disponible
 * Ademas cambia http por https
 * @param {String} url
 */
function formattedCover(url) {
    let index = url.indexOf("zoom=1");
    let start = url.slice(url.indexOf("//books"), index);
    let end = url.slice(url.indexOf("&edge"));
    let newUrl = "https:" + start + "zoom=50" + end;

    return newUrl;
}

app.listen(process.env.PORT);