const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../modules/authenticateJWT');

const { getBalanceAmount, getAllBalance, setBalance } = require('../controllers/balance');
const getAll = require('../modules/get/getAll');
const get = require('../modules/get/get');

// 76ms 
router.get('/get', authenticateJWT, (req, res) => {
	get(req, res, 'balance');
});

router.get('/get-all/:period/:periodNumber?/:year?', authenticateJWT, (req, res) => {
	getAll(req, res, 'balance');
});

router.post('/set', authenticateJWT, setBalance);

module.exports = router;
