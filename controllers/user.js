const User = require('../models/user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

exports.create_user = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }).then((userResult) => {
        if (userResult) {
            res.status(409).json({ message: 'Email already exists' });
        } else {
            const hashedPassword = bcrypt.hash(password, 10, (err, hash) => {
                if (hash) {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: email,
                        password: hash,
                    });
                    user.save()
                        .then((result) =>
                            res.status(201).json({
                                message: 'Success',
                                result,
                                token: generateToken(result._id),
                            })
                        )
                        .catch((err) =>
                            res.status(500).json({
                                message: 'An error occured',
                                Error: err,
                            })
                        );
                }
            });
        }
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email })
        .then((user) => {
            console.log(user);
            if (!user) {
                return res.status(404).json({ message: 'User does not exist' });
            }
            if (user && bcrypt.compareSync(password, user.password)) {
                res.status(201).json({
                    user,
                    token: generateToken(user._id),
                });
            } else {
                res.status(401).json({ message: 'Wrong password' });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: 'An error occured', Error: err });
        });
};

const generateToken = (id) => {
    return jwt.sign({ id }, 'hello');
};
