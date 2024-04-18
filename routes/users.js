// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/auth');
const { authenticateJWT } = require('../modules/authenticateJWT');
const { getBalance } = require('../controllers/balance');
const { getAllIncome, addIncome } = require('../controllers/income');
const { getAllSaving, addSaving } = require('../controllers/saving');



router.post('/signup', signup);

router.post('/signin', signin);



router.get('/getBalance', authenticateJWT, getBalance);



router.get('/getIncome', authenticateJWT, getAllIncome);

router.post('/addIncome', authenticateJWT, addIncome);




router.get('/getSaving', authenticateJWT, getAllSaving);

router.post('/addSaving', authenticateJWT, addSaving);





module.exports = router;
