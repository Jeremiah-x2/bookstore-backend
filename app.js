const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

mongoose.connect(
    'mongodb+srv://asdfasdf:asdfasdf@cluster0.pjllrgd.mongodb.net/bookstore'
);
// mongoose.connect('mongodb://127.0.0.1:27017/bookstore');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/books', bookRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);

app.use(errorHandler);

module.exports = app;
