// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/auth');
const { authenticateJWT } = require('../modules/authenticateJWT');
const { getBalance, setBalance } = require('../controllers/balance');
const { getAllIncome, addIncome } = require('../controllers/income');
const { getAllSaving, addSaving } = require('../controllers/saving');
const { getAllExpenses, addExpenses } = require('../controllers/expenses');



router.post('/signup', signup);

router.post('/signin', signin);



router.get('/getBalance', authenticateJWT, getBalance);

router.post('/setBalance', authenticateJWT, setBalance);




router.get('/getIncome', authenticateJWT, getAllIncome);

router.post('/addIncome', authenticateJWT, addIncome);




router.get('/getSaving', authenticateJWT, getAllSaving);

router.post('/addSaving', authenticateJWT, addSaving);



router.get('/getExpenses', authenticateJWT, getAllExpenses);

router.post('/addExpenses', authenticateJWT, addExpenses);





module.exports = router;
