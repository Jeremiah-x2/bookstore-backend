const express = require('express');
const mongoose = require('mongoose');
const Books = require('../models/books');
const Order = require('../models/order');

exports.get_books = (req, res) => {
    Books.find()
        .exec()
        .then((result) => {
            console.log(result);
            res.json({ count: result.length, result });
        })
        .catch();
};

exports.get_books_for_authenticated = async (req, res) => {
    try {
        // Query the Book model to get the list of books
        const books = await Books.find();

        // Fetch orders for each book
        const booksWithOrders = await Promise.all(
            books.map(async (book) => {
                const orders = await Order.find({
                    book: book._id.toString(),
                    user: req.user,
                });
                return {
                    ...book.toObject(),
                    orders,
                    boo: book._id,
                    userr: req.user,
                };
            })
        );

        res.json({ result: booksWithOrders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.get_book_by_id = (req, res) => {
    Books.findOne({ _id: req.params.bookId })
        .exec()
        .then((book) =>
            res.status(200).json({ message: 'Success', item: book })
        )
        .catch((err) =>
            res.status(500).json({ message: 'An Error occured', Error: err })
        );
};

exports.create_order = async (req, res) => {
    const check = await Books.findOne({
        _id: req.params.orderId,
        orders: { $elemMatch: { user: req.user } },
    });
    if (!check) {
        Books.findOneAndUpdate(
            { _id: req.params.orderId },
            { $push: { orders: { user: req.user, quantity: 1 } } },
            { returnOriginal: false }
        )
            .then((result) => res.json({ result, check }))
            .catch((err) => res.json(err));
    } else {
        res.status(409).json({ message: 'Order already exists' });
    }
};

exports.get_orders = (req, res) => {
    Books.find({ 'orders.user': req.user })
        .then((result) => res.json({ count: result.length, result }))
        .catch((err) => res.json({ err }));
};

exports.update_order = async (req, res) => {
    Books.updateOne(
        { _id: req.params.orderId, 'orders.user': req.user },
        { $inc: { 'orders.$.quantity': 5 } }
    )
        .then((result) => res.json({ result }))
        .catch((err) => res.json({ err }));
};
