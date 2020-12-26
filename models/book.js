const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: String,
    authors: [String],
    publisher: String,
    publishedDate: String,
    thumbnail: String,
    infoLink: String

})

module.exports = mongoose.model('Book', BookSchema);