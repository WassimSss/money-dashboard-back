const mongoose = require('mongoose');

const debtSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Référence à la collection des utilisateurs
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    userIsDebtor: {
        type: Boolean,
        required: true
    },
    debtor: {
        type: String,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
});

const Debt = mongoose.model('Debt', debtSchema);

module.exports = Debt;