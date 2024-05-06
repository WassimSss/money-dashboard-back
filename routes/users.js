// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../modules/authenticateJWT');
const { signup, signin } = require('../controllers/auth');
const { setBudget, getBudget, getMonthBudget } = require('../controllers/budget');

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/setBudget', authenticateJWT, setBudget);

router.get('/getBudget/:period/:periodNumber?', authenticateJWT, getBudget);

router.get('/getMonthBudget/:period/:month?/:year?', authenticateJWT, getMonthBudget);

module.exports = router;
