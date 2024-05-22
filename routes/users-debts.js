var express = require('express');
const { authenticateJWT } = require('../modules/authenticateJWT');
const { getDebt, addDebt, getAllDebts, deleteDebt, acceptDebt } = require('../controllers/debt');
const getAll = require('../modules/get/getAll');
const get = require('../modules/get/get');
var router = express.Router();

/* GET home page. */
router.get('/get', authenticateJWT, (req, res) => {
	get(req, res, 'debts');
});

router.get('/get-all/:period/:periodNumber?/:year?', authenticateJWT, (req, res) => {
	getAll(req, res, 'debts');
});

router.post('/add', authenticateJWT, addDebt);

router.post('/accept', authenticateJWT, acceptDebt);


router.delete('/delete', authenticateJWT, deleteDebt);

module.exports = router;
