const express = require('express');
const passport = require("passport");
const got = require('got');
const getRandomBook = require('../utils/books');

const router = express.Router();

router.get("/", function(req, res) {
    res.render("landing");
});

router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
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

router.get('/login', function(req, res) {
    res.render('login');
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/search',
    failureRedirect: '/login'
}), function(req, res) {})

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
})

router.get("/search", function(req, res) {
    res.render("search");
});

router.get("/results", function(req, res) {
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

module.exports = router;