const nodemailer = require('nodemailer');
const Order = require('../models/order');
const BoughtItem = require('../models/boughtitems');
const Book = require('../models/books');

exports.buy_items = (req, res) => {
    console.log(req.user);
    Order.find({ user: req.user })
        .then((result) => {
            result.forEach(async (item) => {
                const checkItem = await BoughtItem.findOne({
                    user: req.user._id,
                    book: item.book,
                });
                const priceItem = await Book.findById(item.book);
                const orderQuantity = await Order.findById(item._id);
                const buyItem = new BoughtItem({
                    user: req.user,
                    order: item._id,
                    quantity: orderQuantity.quantity,
                    price: priceItem.price,
                    book: priceItem._id,
                });
                buyItem.save().then((success) => {
                    Order.findByIdAndDelete(item._id).then(
                        (deletedOrder) => {}
                    );
                });
            });

            res.status(201).json(result);
        })
        .catch((err) => {
            res.json(err);
        });
};
