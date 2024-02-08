const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');
const boughtItemRoutes = require('./routes/bought_items');
const { errorHandler } = require('./middleware/errorMiddleware');
mongoose.connect('mongodb://127.0.0.1:27017/bookstore');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }
    next();
});

// app.get('/set-cookie', (req, res) => {
//     res.cookie('newCookie', 'I am a new cookie');
//     res.send('Cookies sent');
// });

// app.get('/get-cookie', (req, res) => {
//     const cookie = req.cookies;
//     console.log(cookie);
// });
app.use('/books', bookRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/bought', boughtItemRoutes);

app.use(errorHandler);

module.exports = app;
