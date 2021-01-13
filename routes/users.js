const express = require('express');
const Book = require("../models/book");
const User = require("../models/user");

const router = express.Router();

router.post('/:user_id/save', function(req, res) {
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

router.get("/:user_id/saved", function(req, res) { //aca va un middleware
    User.findById(req.params.user_id).populate("books").exec(function(err, user) {
        if (err) {
            console.log(err);
        } else {
            res.render("savedbooks", { user: user });
        }
    })

})

router.delete("/:user_id/saved/:book_id", function(req, res) {
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

module.exports = router;