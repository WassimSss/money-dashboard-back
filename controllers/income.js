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

		const income = await Income.find({ user: idUser, status: "pending" });

		income.sort((a, b) => {
			return new Date(b.date) - new Date(a.date);
		});

		res.json({ result: true, income });
	}
];

exports.getVirementOfMonth = [

	async (req, res) => {
		const idUser = req.user.id;
		const { monthNumber } = req.params;

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/income"
			});
		}

		const today = new Date();

		const firstDayOfMonth = new Date(today.getFullYear(), monthNumber - 1, 1);
		const lastDayOfMonth = new Date(today.getFullYear(), monthNumber, 0);

		const income = await Income.find({
			user: idUser,
			type: "virement",
			status: "accepted",
			date: {
				$gte: new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), firstDayOfMonth.getDate()),
				$lte: new Date(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth(), lastDayOfMonth.getDate())
			}
		});

		const sum = income.reduce((total, item) => total + item.amount, 0); 
		res.json({ result: true, income: sum});
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
			status: 'pending'
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

// Accepter un revenu et le mettre dans la balance en l'ajoutant
exports.acceptIncome = [
	async (req, res) => {
		const idUser = req.user.id;

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/balance"
			});
		}

		const { idIncome } = req.body;

		const income = await Income.findOne({ _id: idIncome, status: 'pending' });

		if (!income) {
			return res.status(400).json({ result: false, message: "Erreur lors de la récuperation de l'income" });
		}

		const user = await findUserById(idUser);

		// Recuperer le solde de l'utilisateur

		const balance = user.balance;

		// if (!balance) {
		//	return res.status(400).json({ result: false, message: "Erreur lors de la récuperation de la balance" });
		// }

		// Ajouter le revenu dans le solde de l'utilisateur

		// Si le revenu est un virement, on l'ajoute au solde

		if (income.type === 'virement') {
			user.balance = balance + income.amount;
		} else {
			user.balance = balance - income.amount;
		}

		// Et enlever le revenu de la liste des revenus

		// Mettre le income a status accepted
		income.status = 'accepted';

		await income.save();

		// if (!incomeAccepted) {
		//			return res.status(400).json({ result: false, message: "Erreur lors de la sauvegarde de l'income" });
		// }

		await user.save();

		res.status(200).json({ result: true, message: "Ajout de l'income dans la balance réussie !" });
	}
];

// Supprimer un revenu
exports.deleteIncome = [
	async (req, res) => {
		const idUser = req.user.id;

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/balance"
			});
		}

		const { idIncome } = req.body;

		const income = await Income.findByIdAndDelete(idIncome);

		if (!income) {
			return res.status(400).json({ result: false, message: "Erreur lors de la suppression de l'income" });
		}

		res.status(200).json({ result: true, message: "Suppression de l'income réussie !" });
	}
];
