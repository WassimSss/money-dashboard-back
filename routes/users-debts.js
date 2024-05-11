var express = require('express');
const { authenticateJWT } = require('../modules/authenticateJWT');
const { getDebt, addDebt, getAllDebts, deleteDebt } = require('../controllers/debt');
var router = express.Router();

/* GET home page. */
router.get('/get', authenticateJWT, getDebt);

router.get('/get-all', authenticateJWT, getAllDebts);

router.post('/add', authenticateJWT, addDebt);

router.delete('/delete', authenticateJWT, deleteDebt);


module.exports = router;
