// controllers/auth.js
const { body, validationResult } = require('express-validator');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = [
	// Vérifications pour firstName et lastName
	body('firstName').isLength({ min: 2, max: 20 }).withMessage('Le prénom doit comporter entre 2 et 20 caractères.'),
	body('lastName')
		.isLength({ min: 2, max: 20 })
		.withMessage('Le nom de famille doit comporter entre 2 et 20 caractères.'),
	// Vérification pour email
	body('email').isEmail().withMessage('Veuillez entrer un email valide.'),
	body('confirmEmail').custom((value, { req }) => {
		if (value !== req.body.email) {
			throw new Error('Les emails ne correspondent pas.');
		}
		return true;
	}),
	// Vérification pour password
	body('password')
		.isLength({ min: 6, max: 24 })
		.withMessage('Le mot de passe doit comporter entre 6 et 24 caractères.')
		.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/, 'i')
		.withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre.'),
	body('confirmPassword').custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error('Les mots de passe ne correspondent pas.');
		}
		return true;
	}),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ result: false, errors: errors.array() });
		}

		const { firstName, lastName, email, password, confirmEmail, confirmPassword } = req.body;

		// Vérifiez si les emails correspondent
		if (email !== confirmEmail) {
			return res.status(400).json({ result: false, message: 'Les emails ne correspondent pas.' });
		}

		// Vérifiez si les mots de passe correspondent
		if (password !== confirmPassword) {
			return res.status(400).json({ result: false, message: 'Les mots de passe ne correspondent pas.' });
		}

		try {
			// Vérifiez si l'utilisateur existe déjà
			let user = await User.findOne({ email });
			if (user) {
				return res.status(400).json({ result: false, message: 'Un utilisateur avec cet email existe déjà.' });
			}

			// Créez un nouvel utilisateur

			const hashedPassword = await bcrypt.hash(password, 10);

			user = new User({
				firstName,
				lastName,
				email,
				password: hashedPassword // Assurez-vous de hacher le mot de passe avant de l'enregistrer
			});

			console.log(user);

			// Enregistrez l'utilisateur dans la base de données
			await user.save();

			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

			res.status(201).json({ result: true, message: 'Utilisateur enregistré avec succès.', token });
		} catch (error) {
			console.log(error);
			res.status(500).json({ result: false, message: "Erreur lors de l'enregistrement de l'utilisateur." });
		}
	}
];

exports.signin = [
	body('email').isLength({ min: 1 }).withMessage("L'email est requis."),
	body('password').isLength({ min: 1 }).withMessage('Le mot de passe est requis.'),
	// .isLength({ min: 6, max: 24 })
	// .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/, 'i')
	// .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre.'),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ result: false, errors: errors.array() });
		}

		try {
			const { email, password } = req.body;

			console.log(email, password);

			const user = await User.findOne({ email: email });

			if (!user) {
				return res.status(400).json({ result: false, message: "L'email ou le mot de passe est incorrect." });
			}

			console.log(password, user.password);

			if (!bcrypt.compareSync(password, user.password)) {
				return res.status(400).json({ result: false, message: "L'email ou le mot de passe est incorrect." });
			}

			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY /*, { expiresIn: '1h' }*/);

			return res.status(201).json({ result: true, token });
		} catch (error) {
			console.log(error);
			res.status(500).json({ result: false, message: 'Erreur lors de la connexion' });
		}
	}
];


