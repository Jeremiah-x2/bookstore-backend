const express = require('express');
const mongoose = require('mongoose');
const Books = require('../models/books');
const Order = require('../models/order');

exports.get_books = async (req, res) => {
    console.log(req.user);
    if (req.user) {
        try {
            const books = await Books.find();
            const booksWithOrders = await Promise.all(
                books.map(async (book) => {
                    const orders = await Order.findOne({
                        book: book._id.toString(),
                        user: req.user,
                    });
                    return {
                        ...book.toObject(),
                        orders,
                    };
                })
            );

            res.json({ result: booksWithOrders });
        } catch (error) {
            console.error(error);
            res.cookie('dfjskf', 'dksgjdsk');

            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        Books.find()
            .exec()
            .then((result) => {
                res.cookie('dfjskf', 'dksgjdsk');
                res.json({ count: result.length, result });
            })
            .catch();
    }
};

exports.get_book_by_id = async (req, res) => {
    try {
        const bookById = await Books.findById(req.params.bookId);
        console.log(bookById);
        if (bookById) {
            if (req.user) {
                const isUserOrdered = await Order.findOne({
                    book: bookById._id,
                    user: req.user._id,
                });
                // console.log('Ordered\n'.repeat(3), isUserOrdered);
                if (isUserOrdered) {
                    res.json({
                        ...bookById.toObject(),
                        orders: isUserOrdered.toObject(),
                    });
                } else {
                    res.json({ ...bookById.toObject() });
                }
            } else {
                res.json({ ...bookById.toObject() });
            }
        } else {
            console.log('Book not found');
            throw new Error('Book not found');
        }
    } catch (error) {
        res.json(error);
    }
};

/*
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
*/
