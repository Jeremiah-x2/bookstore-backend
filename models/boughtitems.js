const mongoose = require('mongoose');
const Order = require('./order');
const Book = require('./books');
const User = require('./user');

const boughtItemSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: Number,
    price: Number,
});

module.exports = mongoose.model('BoughtItem', boughtItemSchema);
