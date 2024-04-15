// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
// const { authenticateJWT } = require('../modules/authenticateJWT');

// router.get('/check-auth', authenticateJWT);

router.get('/check-auth', (req, res) => {
	const token = req.headers.authorization.split(' ')[1]; // Supposant que le token est envoyé sous la forme "Bearer <token>"
	console.log(req.headers);
	console.log('token : ', token);
	try {
		if (!token) {
			return res.status(401).json({ isAuthenticated: false, message: 'Aucun token fourni' });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

		if (decoded) {
			return res.status(201).json({ isAuthenticated: true });
		}

		return res.status(401).json({ isAuthenticated: false, message: 'Authentification requise' });

		// Si le token est valide, 'decoded' contiendra les informations décodées du token
	} catch (err) {
		// Si le token est invalide ou expiré, une exception sera levée
		console.error('Token invalide:', err);
	}
});

module.exports = router;
