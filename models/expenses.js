const mongoose = require('mongoose');

// Schéma pour les dépenses (expenses)
const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Référence à la collection des utilisateurs
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExpensesCategory', // Référence à la collection des catégories de dépenses
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    }
});

expenseSchema.index({ user: 1 });
expenseSchema.index({ date: 1 });
expenseSchema.index({ user: 1, date: 1 });


// Modèle pour les dépenses
const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
