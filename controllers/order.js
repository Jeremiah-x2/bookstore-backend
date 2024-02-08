const mongoose = require('mongoose');
const Order = require('../models/order');
const Book = require('../models/books');
const User = require('../models/user');

exports.create_order = async (req, res) => {
    const check = await Order.findOne({
        book: req.body.book,
        user: req.user,
    });
    if (!check) {
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            user: req.user,
            book: req.body.book,
            quantity: 1,
        });
        order
            .save()
            .then((result) =>
                res.status(201).json({ message: 'Success', result })
            )
            .catch((err) =>
                res
                    .status(500)
                    .json({ message: 'An Error occured', Error: err })
            );
    } else {
        res.status(201).json({ message: 'Order already exists' });
    }
};

exports.get_orders = (req, res) => {
    if (req.user) {
        Order.find({ user: req.user })
            .populate('book')
            .exec()
            .then((orders) => {
                res.cookie('orders', 'orders array');
                res.json({ orders, user: req.user });
            })
            .catch((err) => res.json({ err }));
    } else {
        res.status(403).json({ message: 'User not logged in' });
    }

    // Order.find({ user: req.user })
    //     .exec()
    //     .then((orders) => {
    //         // res.json({ orders, user: req.user });
    //         Order.find()
    //     })
    //     .catch((err) => res.json({ err }));
};

exports.get_order_by_id = (req, res) => {
    Order.findById(req.params.orderId)
        .exec()
        .then((result) => {
            const book = Book.findById(result.book).then((bookRes) => {
                res.json({ result: result, book: bookRes });
            });
        })
        .catch((err) => res.status(500).json({ err }));
};

exports.update_order = async (req, res) => {
    try {
        const findAndUpdateOrder = await Order.findOneAndUpdate(
            { book: req.params.orderId, user: req.user },
            {
                $inc: { quantity: req.body.incValue },
            }
        );

        if (updateOrder.quantity < 1) {
            const deleteOrder = await Order.findOneAndDelete({
                _id: req.params.orderId,
                user: req.user,
            });
            res.json({ message: 'Order deleted successfully' });
            console.log('Deleted order', deleteOrder);
        } else {
            res.status(201).json(updateOrder);
        }
    } catch (error) {
        res.json({ error });
    }
};

exports.delete_order = async (req, res) => {
    const deleteOrder = await Order.findOneAndDelete({
        book: req.params.orderId,
        user: req.user,
    });
    console.log(deleteOrder);
    res.json(deleteOrder);
};
