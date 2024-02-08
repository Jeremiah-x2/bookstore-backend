const User = require('../models/user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

exports.create_user = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const isUser = await User.findOne({ email });
        if (isUser) {
            res.status(409).json({ message: 'Email already exists' });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await new User({
                _id: new mongoose.Types.ObjectId(),
                email,
                name,
                password: hashedPassword,
            });
            user.save()
                .then((newUser) => {
                    const token = generateToken(newUser._id);
                    res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24 });
                    res.status(201).json({
                        message: 'Success',
                        result,
                        token: generateToken(newUser._id),
                    });
                })
                .catch((err) =>
                    res.status(500).json({
                        message: 'An error occured',
                        Error: err,
                    })
                );
        }
    } catch (error) {
        res.json({ error });
    }
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
                const token = generateToken(user._id);
                res.cookie('token', token, {
                    maxAge: 1000 * 60 * 60 * 24,
                    // sameSite: 'None',
                });
                res.cookie('user', user._id);
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

exports.get_user = (req, res) => {
    const { userId } = req.params;
    console.log(userId);
    if (req.user && req.user.id === userId) {
        User.findById(userId)
            .then((user) => {
                res.status(200).json({ name: user.name, email: user.email });
            })
            .catch((err) => res.json(err));
    } else {
        res.status(401).json({
            message: 'Not authorized to get the requested user',
        });
    }
};

const generateToken = (id) => {
    return jwt.sign({ id }, 'hello');
};
