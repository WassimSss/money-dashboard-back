const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
<<<<<<< HEAD
    firstname: {
        type: String,
        required: true
    },
    lastname: {
=======
    firstName: {
        type: String,
        required: true
    },
    lastName: {
>>>>>>> f7d87f47489b49dfb00c3689e7cb19d0b2c9193c
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
<<<<<<< HEAD
=======
    balance: {
        type: Number,
        default: 0
    }
>>>>>>> f7d87f47489b49dfb00c3689e7cb19d0b2c9193c
});

const User = mongoose.model('User', userSchema);

module.exports = User;