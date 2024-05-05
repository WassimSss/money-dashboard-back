const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../modules/authenticateJWT');

const {
	addExpensesCategory,
	getExpensesCategories,
	addBudgetOfExpensesCategory
} = require('../controllers/expensesCategory');

router.get('/get', authenticateJWT, getExpensesCategories);

router.post('/add', authenticateJWT, addExpensesCategory);

router.post('/add-budget', authenticateJWT, addBudgetOfExpensesCategory);
 
module.exports = router;
