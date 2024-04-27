const mongoose = require('mongoose');

// Schéma pour les revenus
const incomeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Référence à la collection des utilisateurs
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: ''

    },
    description: {
        type: String,
        default: ''
    },
    paymentDate: {
        type: Date,
        // default: Date.now
    },
    source: {
        type: String,
        default: ''
    },
    paymentMethod: {
        type: String,
        default: ''
    },
    frequency: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: ''
    }
});

// Modèle pour les revenus
const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;
