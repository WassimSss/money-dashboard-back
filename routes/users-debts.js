var express = require('express');
const { authenticateJWT } = require('../modules/authenticateJWT');
const { getDebt, addDebt, getAllDebts, deleteDebt } = require('../controllers/debt');
const getAll = require('../modules/get/getAll');
var router = express.Router();

/* GET home page. */
router.get('/get', authenticateJWT, getDebt);

router.get('/get-all/:period/:periodNumber?/:year?', authenticateJWT, (req, res) => {
	getAll(req, res, 'debts');
});

router.post('/add', authenticateJWT, addDebt);

router.delete('/delete', authenticateJWT, deleteDebt);

module.exports = router;
