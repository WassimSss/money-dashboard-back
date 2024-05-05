// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../modules/authenticateJWT');
const { signup, signin } = require('../controllers/auth');
const { setBudget, getBudget } = require('../controllers/budget');

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/setBudget', authenticateJWT, setBudget);

router.get('/getBudget/:period/:periodNumber?', authenticateJWT, getBudget);

module.exports = router;
