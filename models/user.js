const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: [true, 'Please enter your name'],
    },
    email: {
        type: String,
        required: [true, 'Provide an email address'],
        unique: true,
        validate: [isEmail, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Please create a password'],
        minlength: [6, 'Minimum password length is 6 characters'],
    },
    age: Number,
    location: String,
});

module.exports = mongoose.model('User', userSchema);
