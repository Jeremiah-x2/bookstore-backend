const express = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.cookies._vercel_jwt) {
        try {
            token = req.cookies._vercel_jwt;
            const decoded = jwt.verify(token, 'hello');
            req.user = await User.findById(decoded.userId).select('-password');
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not Authorized');
        }
    }

    // if (!token) {
    //     res.status(401);
    //     throw new Error('Not Authorized');
    // }
    next();
});

module.exports = protect;
