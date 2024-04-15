// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/auth');
const { authenticateJWT } = require('../modules/authenticateJWT');
const { getBalance } = require('../controllers/balance');



router.post('/signup', signup);

router.post('/signin', signin);

router.get('/:id/getBalance', authenticateJWT, getBalance);




module.exports = router;
