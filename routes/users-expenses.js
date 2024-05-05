const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../modules/authenticateJWT');
const { getExpensesAmount, getAllExpenses, getExpensesAmountToday, addExpenses, deleteExpenses, getExpensesAmountWeek, getExpensesAmountMonth, getExpensesByCategory, getExpensesByPeriod } = require('../controllers/expenses');

router.get('/get', authenticateJWT, getExpensesAmount);

// router.get('/get-by-period/:period/:period', authenticateJWT, getExpensesAmount);

router.get('/get-by-period/:period/:periodNumber?', authenticateJWT, getExpensesByPeriod);

// router.get('/getExpenses/day', authenticateJWT, getExpensesAmountToday);

// router.get('/getExpenses/week', authenticateJWT, getExpensesAmountWeek);

// router.get('/getExpenses/month/:monthNumber', authenticateJWT, getExpensesAmountMonth);

// router.get('/getExpensesByCategory/:period', authenticateJWT, getExpensesByCategory);

router.get('/get-all/:period/:periodNumber?', authenticateJWT, getAllExpenses);

router.post('/add', authenticateJWT, addExpenses);

router.delete('/delete', authenticateJWT, deleteExpenses);

module.exports = router;
