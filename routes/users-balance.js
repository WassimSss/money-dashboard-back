const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../modules/authenticateJWT');

const { getBalanceAmount, getAllBalance, setBalance } = require('../controllers/balance');

router.get('/get', authenticateJWT, getBalanceAmount);

router.get('/get-all', authenticateJWT, getAllBalance);

router.post('/set', authenticateJWT, setBalance);

module.exports = router;
