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
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        Books.find()
            .exec()
            .then((result) => {
                res.json({ count: result.length, result });
            })
            .catch((error) => {
                res.status(500).json({ Error: error });
            });
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
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};
