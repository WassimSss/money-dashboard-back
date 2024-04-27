// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/auth');
const { authenticateJWT } = require('../modules/authenticateJWT');
const { getBalanceAmount, setBalance } = require('../controllers/balance');
const { getIncomeAmount, addIncome, getAllIncome } = require('../controllers/income');
const { getSavingAmount, addSaving } = require('../controllers/saving');
const { getExpensesAmount, getAllExpenses, addExpenses } = require('../controllers/expenses');



router.post('/signup', signup);

router.post('/signin', signin);



router.get('/getBalance', authenticateJWT, getBalanceAmount);

router.post('/setBalance', authenticateJWT, setBalance);




router.get('/getIncome', authenticateJWT, getIncomeAmount);

router.get('/getAllIncome', authenticateJWT, getAllIncome);


router.post('/addIncome', authenticateJWT, addIncome);




router.get('/getSaving', authenticateJWT, getSavingAmount);

router.post('/addSaving', authenticateJWT, addSaving);



router.get('/getExpenses', authenticateJWT, getExpensesAmount);

router.get('/getAllExpenses', authenticateJWT, getAllExpenses);

router.post('/addExpenses', authenticateJWT, addExpenses);





module.exports = router;
