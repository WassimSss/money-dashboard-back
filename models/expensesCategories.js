const mongoose = require('mongoose');


const expensesCategoriesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    category: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        default: null
    }
});

const ExpensesCategory = mongoose.model('ExpensesCategory', expensesCategoriesSchema);

module.exports = ExpensesCategory;