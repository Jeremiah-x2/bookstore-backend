const User = require('../models/user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

exports.create_user = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const findUser = await User.findOne({ email: email });
        console.log(findUser);
        if (findUser) {
            return res.status(409).json({
                message: 'User already exists',
                user: findUser,
            });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        if (!hashPassword) {
            throw new Error('Failed to hash password');
        }
        const createUser = await new User({
            _id: new mongoose.Types.ObjectId(),
            email,
            name,
            password: hashPassword,
        }).save();
        const token = generateToken(createUser._id);
        // res.cookie('token', token, {
        //     maxAge: 1000 * 60 * 60 * 24,
        //     sameSite: 'none',
        //     secure: true,
        // } );
        const cookie = `token=${token}; samesite=none; secure; max-age=3600000; httponly=true`;
        res.setHeader('set-cookie', [cookie]);
        res.status(201).json({
            user: createUser,
            message: 'Successful',
            token,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            msg: 'An error occurred',
            error: error.message,
        });
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
                    sameSite: 'none',
                    secure: true,
                });
                // const cookie = `token=${token}; samesite=none; secure; max-age=3600000; httponly=true`;
                // res.setHeader('set-cookie', [cookie]);
                res.status(201).json({
                    user,
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
    console.log(req.cookie);
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

exports.logout_post = (req, res) => {
    console.log(req.user);
    console.log(req.cookies);
    res.cookie('token', 'ddkljdklsjlk', { maxAge: 1 });
    res.status(201).json({ msg: 'Logged out' });
};

const generateToken = (id) => {
    return jwt.sign({ id }, 'hello');
};
