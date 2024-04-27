// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/auth');
const { authenticateJWT } = require('../modules/authenticateJWT');
const { getBalanceAmount, setBalance } = require('../controllers/balance');
const { getIncomeAmount, addIncome, getAllIncome, acceptIncome, deleteIncome } = require('../controllers/income');
const { getSavingAmount, getAllSaving, addSaving, deleteSaving } = require('../controllers/saving');
const { getExpensesAmount, getAllExpenses, addExpenses, deleteExpenses } = require('../controllers/expenses');

router.post('/signup', signup);

router.post('/signin', signin);

router.get('/getBalance', authenticateJWT, getBalanceAmount);

router.post('/setBalance', authenticateJWT, setBalance);

router.get('/getIncome', authenticateJWT, getIncomeAmount);

router.get('/getAllIncome', authenticateJWT, getAllIncome);

router.post('/addIncome', authenticateJWT, addIncome);

router.post('/acceptIncome', authenticateJWT, acceptIncome);

router.delete('/deleteIncome', authenticateJWT, deleteIncome);

router.get('/getSaving', authenticateJWT, getSavingAmount);

router.get('/getAllSaving', authenticateJWT, getAllSaving);

router.post('/addSaving', authenticateJWT, addSaving);

router.delete('/deleteSaving', authenticateJWT, deleteSaving);

router.get('/getExpenses', authenticateJWT, getExpensesAmount);

router.get('/getAllExpenses', authenticateJWT, getAllExpenses);

router.post('/addExpenses', authenticateJWT, addExpenses);

router.delete('/deleteExpenses', authenticateJWT, deleteExpenses);

module.exports = router;
