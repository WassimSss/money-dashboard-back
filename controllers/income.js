const Income = require('../models/incomes');
const { findUserById, getIncomeOfUser } = require('../modules/userRequest');

exports.getIncomeAmount = [
	async (req, res) => {
		const idUser = req.user.id;

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/balance"
			});
		}

		const income = await getIncomeOfUser(idUser);
		console.log('in serv ', income);
		if (!income && income !== 0) {
			return res
				.status(400)
				.json({ result: false, message: 'Erreur lors de la récuperation de tout les revenus' });
		}
		// const allIncomes = await User.find({ user: idUser });

		// if (!allIncomes) {

		// }

		res.status(200).json({ result: true, income });
	}
];

exports.getAllIncome = [
	async (req, res) => {
		const idUser = req.user.id;

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/income"
			});
		}

		const income = await Income.find({ user: idUser });

		income.sort((a, b) => {
			return new Date(b.date) - new Date(a.date);
		});

		res.json({ result: true, income });
	}
];

exports.addIncome = [
	async (req, res) => {
		const idUser = req.user.id;
		const today = new Date();

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/balance"
			});
		}

		const { amount, type, category, description, paymentDate, source, paymentMethod, frequency, status } = req.body;

		console.log(paymentDate);
		if (!amount) {
			return res.status(400).json({ result: false, message: 'Veuillez rentrer un montant' });
		}

		if (!paymentDate) {
			return res.status(400).json({ result: false, message: 'Veuillez rentrer une date de paiement' });
		}

		if (new Date(paymentDate).getTime() < today.getTime()) {
			return res.status(400).json({
				result: false,
				message: "Veuillez ne pouvez pas entrer une date de paiement inférieur à la date d'aujourd'hui"
			});
		}

		const newIncome = new Income({
			user: idUser,
			amount,
			type,
			category,
			description,
			date: paymentDate,
			source,
			paymentMethod,
			frequency,
			status
		});

		const income = await newIncome.save();

		console.log(income);

		if (!income) {
			res.status(400).json({ result: false, message: "Erreur lors de la création de l'income" });
		}

		const sumIncome = await getIncomeOfUser(idUser);

		res.status(200).json({ result: true, income: sumIncome, message: "Ajout de l'income réussie !" });
	}
];
