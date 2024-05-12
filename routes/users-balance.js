const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../modules/authenticateJWT');

const { getBalanceAmount, getAllBalance, setBalance } = require('../controllers/balance');
const getAll = require('../modules/get/getAll');

router.get('/get', authenticateJWT, getBalanceAmount);

router.get('/get-all/:period/:periodNumber?/:year?', authenticateJWT, (req, res) => {
	getAll(req, res, 'balance');
});

router.post('/set', authenticateJWT, setBalance);

module.exports = router;
