const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../modules/authenticateJWT');
const {
	getExpensesAmount,
	getAllExpenses,
	getExpensesAmountToday,
	addExpenses,
	deleteExpenses,
	getExpensesAmountWeek,
	getExpensesAmountMonth,
	getExpensesByCategory,
	getExpensesByPeriod
} = require('../controllers/expenses');
const getAll = require('../modules/get/getAll');

router.get('/get', authenticateJWT, getExpensesAmount);

// router.get('/get-by-period/:period/:period', authenticateJWT, getExpensesAmount);

router.get('/get-by-period/:period/:periodNumber?/:year?', authenticateJWT, getExpensesByPeriod);

router.get('/get-all/:period/:periodNumber?/:year?', authenticateJWT, (req, res) => {
	getAll(req, res, 'expenses');
});

router.post('/add', authenticateJWT, addExpenses);

router.delete('/delete', authenticateJWT, deleteExpenses);

module.exports = router;
