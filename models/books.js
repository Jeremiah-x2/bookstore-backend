const mongoose = require('mongoose');
const User = require('./user');

const bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String },
    author: { type: String },
    genre: { type: String },
    price: { type: Number },
    publication_date: { type: String },
    publisher: { type: String },
    isbn: { type: String },
    language: { type: String },
    stock_quantity: { type: Number },
    category: { type: String },
    image: { type: String },
    orders: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            quantity: Number,
        },
    ],
});

module.exports = mongoose.model('Book', bookSchema);
