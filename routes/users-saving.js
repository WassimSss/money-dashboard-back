const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../modules/authenticateJWT');

const { getSavingAmount, getAllSaving, addSaving, deleteSaving } = require('../controllers/saving');
const getAll = require('../modules/get/getAll');
const get = require('../modules/get/get');

router.get('/get', authenticateJWT, (req, res) => {
	get(req, res, 'savings');
});


router.get('/get-all/:period/:periodNumber?/:year?', authenticateJWT, (req, res) => {
	getAll(req, res, 'savings');
});

router.post('/add', authenticateJWT, addSaving);

router.delete('/delete', authenticateJWT, deleteSaving);

module.exports = router;
