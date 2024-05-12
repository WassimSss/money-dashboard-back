const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../modules/authenticateJWT');

const {
	getIncomeAmount,
	addIncome,
	getAllIncome,
	acceptIncome,
	deleteIncome,
	getVirementOfMonth
} = require('../controllers/income');
const getAll = require('../modules/get/getAll');

router.get('/get', authenticateJWT, getIncomeAmount);

router.get('/get-all/:period/:periodNumber?/:year?', authenticateJWT, (req, res) => {
	getAll(req, res, 'incomes');
});

router.get('/virement/month/:monthNumber', authenticateJWT, getVirementOfMonth);

router.post('/add', authenticateJWT, addIncome);

router.post('/accept', authenticateJWT, acceptIncome);

router.delete('/delete', authenticateJWT, deleteIncome);

module.exports = router;
