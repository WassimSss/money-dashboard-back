// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/auth');
const { authenticateJWT } = require('../modules/authenticateJWT');
const { getBalanceAmount, getAllBalance, setBalance } = require('../controllers/balance');
const { getIncomeAmount, addIncome, getAllIncome, acceptIncome, deleteIncome, getVirementOfMonth } = require('../controllers/income');
const { getSavingAmount, getAllSaving, addSaving, deleteSaving } = require('../controllers/saving');
const { getExpensesAmount, getAllExpenses, getExpensesAmountToday, addExpenses, deleteExpenses, getExpensesAmountWeek, getExpensesAmountMonth, getExpensesByCategory } = require('../controllers/expenses');
const { setBudget, getBudget } = require('../controllers/budget');
const { addExpensesCategory, getExpensesCategories, addBudgetOfExpensesCategory } = require('../controllers/expensesCategory');

router.post('/signup', signup);

router.post('/signin', signin);

router.get('/getBalance', authenticateJWT, getBalanceAmount);

router.get('/getAllBalance', authenticateJWT, getAllBalance);

router.post('/setBalance', authenticateJWT, setBalance);

router.get('/getIncome', authenticateJWT, getIncomeAmount);

router.get('/getAllIncome', authenticateJWT, getAllIncome);

router.get('/getVirementOfMonth/month/:monthNumber', authenticateJWT, getVirementOfMonth);

router.post('/addIncome', authenticateJWT, addIncome);

router.post('/acceptIncome', authenticateJWT, acceptIncome);

router.delete('/deleteIncome', authenticateJWT, deleteIncome);

router.get('/getSaving', authenticateJWT, getSavingAmount);

router.get('/getAllSaving', authenticateJWT, getAllSaving);

router.post('/addSaving', authenticateJWT, addSaving);

router.delete('/deleteSaving', authenticateJWT, deleteSaving);

router.get('/getExpenses', authenticateJWT, getExpensesAmount);

router.get('/getExpenses/day', authenticateJWT, getExpensesAmountToday);

router.get('/getExpenses/week', authenticateJWT, getExpensesAmountWeek);

router.get('/getExpenses/month/:monthNumber', authenticateJWT, getExpensesAmountMonth);

router.get('/getExpensesByCategory/:period', authenticateJWT, getExpensesByCategory);

router.get('/getAllExpenses', authenticateJWT, getAllExpenses);

router.get('/getExpensesCategories', authenticateJWT, getExpensesCategories);

router.post('/addExpensesCategory', authenticateJWT, addExpensesCategory);

router.post('/addBudgetOfExpensesCategory', authenticateJWT, addBudgetOfExpensesCategory);

router.post('/addExpenses', authenticateJWT, addExpenses);

router.delete('/deleteExpenses', authenticateJWT, deleteExpenses);

router.post('/setBudget', authenticateJWT, setBudget);

router.get('/getBudget/:period', authenticateJWT, getBudget);






























router.get('/', (req, res) => {

    const user = ["Paul", "¨Pierre", "Marine", "Mofjz", "Maqqd"];

    res.json({ user })
});





module.exports = router;
