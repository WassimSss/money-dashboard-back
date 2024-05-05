const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../modules/authenticateJWT');

const { getSavingAmount, getAllSaving, addSaving, deleteSaving } = require('../controllers/saving');

router.get('/get', authenticateJWT, getSavingAmount);

router.get('/get-all', authenticateJWT, getAllSaving);

router.post('/add', authenticateJWT, addSaving);

router.delete('/delete', authenticateJWT, deleteSaving);

module.exports = router;
