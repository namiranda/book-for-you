const express = require("express"),
    bodyParser = require("body-parser"),
    got = require("got"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override");
passportLocalMongoose = require("passport-local-mongoose");

const User = require("./models/user");
const Book = require("./models/book");

const app = express();
const dotenv = require("dotenv");
const { findById } = require("./models/user");
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride('_method'));

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

let book;

app.post('/:user_id/save', function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
        if (err) {
            console.log(err);
        } else {

            Book.create({
                    title: book.title,
                    authors: book.authors,
                    publisher: book.publisher,
                    publishedDate: book.publishedDate,
                    thumbnail: book.cover_url,
                    infoLink: book.infoLink,
                }, function(err, newBook) {
                    if (err) {
                        console.log(err);
                    } else {
                        newBook.save();
                        user.books.push(newBook);
                        user.save();
                        //TODO: agregar flash message de success
                        res.redirect("/" + req.params.user_id + "/saved");
                    }
                }

            )

        }
    })
})

app.get("/:user_id/saved", function(req, res) { //aca va un middleware
    User.findById(req.params.user_id).populate("books").exec(function(err, user) {
        if (err) {
            console.log(err);
        } else {
            res.render("savedbooks", { user: user });
        }
    })

})

app.delete("/:user_id/saved/:book_id", function(req, res) {
    Book.findByIdAndRemove(req.params.book_id, function(err) {
        if (err) {
            console.log(err);
        } else {
            //TODO:mostrar flash message
            User.findById(req.params.user_id).exec(function(err, user) {
                if (err) {
                    console.log(err);
                } else {
                    user.books.pull({ _id: req.params.book_id });
                    user.save();
                }
            })
            res.redirect("/" + req.params.user_id + "/saved");
        }
    })
})

/**
 * Devuelve un objeto book, que contiene la informacion del libro seleccionado aleatoriamente
 * @param {JSON} data
 */
function getRandomBook(data) {
    let max = data["items"].length;
    let random = Math.floor(Math.random() * max);
    book = {
        title: data["items"][random]["volumeInfo"]["title"],
        authors: data["items"][random]["volumeInfo"]["authors"],
        description: data["items"][random]["volumeInfo"]["description"],
        cover_url: formattedCover(
            data["items"][random]["volumeInfo"]["imageLinks"]["thumbnail"]
        ),
        publisher: data["items"][random]["volumeInfo"]["publisher"],
        publishedDate: data["items"][random]["volumeInfo"]["publishedDate"],
        //thumbnail: String,
        infoLink: data["items"][random]["volumeInfo"]["infoLink"]
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