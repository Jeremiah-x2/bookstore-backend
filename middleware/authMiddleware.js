const express = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.cookies.token) {
        try {
            token = req.cookies.token;
            const decoded = jwt.verify(token, 'hello');
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not Authorized');
        }
    }

    
    next();
});

module.exports = protect;
