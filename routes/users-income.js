const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../modules/authenticateJWT');

const { getIncomeAmount, addIncome, getAllIncome, acceptIncome, deleteIncome, getVirementOfMonth } = require('../controllers/income');

router.get('/get', authenticateJWT, getIncomeAmount);

router.get('/get-all', authenticateJWT, getAllIncome);

router.get('/virement/month/:monthNumber', authenticateJWT, getVirementOfMonth);

router.post('/add', authenticateJWT, addIncome);

router.post('/accept', authenticateJWT, acceptIncome);

router.delete('/delete', authenticateJWT, deleteIncome);

module.exports = router;
