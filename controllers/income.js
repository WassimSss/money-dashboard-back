const Income = require('../models/incomes');
const { findUserById, getIncomeOfUser } = require('../modules/userRequest');
const moment = require('moment');

// exports.getIncomeAmount = [
// 	async (req, res) => {
// 		const idUser = req.user.id;

// 		if (!idUser) {
// 			return res.status(400).json({
// 				result: false,
// 				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/balance"
// 			});
// 		}

// 		const income = await getIncomeOfUser(idUser);
// 		if (!income && income !== 0) {
// 			return res
// 				.status(400)
// 				.json({ result: false, message: 'Erreur lors de la récuperation de tout les revenus' });
// 		}
// 		// const allIncomes = await User.find({ user: idUser });

// 		// if (!allIncomes) {

// 		// }

// 		res.status(200).json({ result: true, income });
// 	}
// ];

// exports.getAllIncome = [
// 	async (req, res) => {
// 		const idUser = req.user.id;

// 		if (!idUser) {
// 			return res.status(400).json({
// 				result: false,
// 				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/income"
// 			});
// 		}

// 		const income = await Income.find({ user: idUser, status: 'pending' }).populate('category');

// 		income.sort((a, b) => {
// 			return new Date(b.date) - new Date(a.date);
// 		});

// 		const formattedIncome = income.map((income) => {
// 			return {
// 				id: income._id,
// 				amount: income.amount,
// 				type: income.type,
// 				category: income.category.category,
// 				description: income.description,
// 				date: income.date,
// 				source: income.source,
// 				paymentMethod: income.paymentMethod,
// 				frequency: income.frequency,
// 				status: income.status
// 			};
// 		});

// 		res.json({ result: true, data: formattedIncome });
// 	}
// ];

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
			type: 'virement',
			status: 'accepted',
			date: {
				$gte: new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), firstDayOfMonth.getDate()),
				$lte: new Date(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth(), lastDayOfMonth.getDate())
			}
		});

		const sum = income.reduce((total, item) => total + item.amount, 0);
		res.json({ result: true, income: sum });
	}
];

// get income of year
exports.getIncomeOfYear = [
	async (req, res) => {
			const idUser = req.user.id;
			const { year } = req.params;
			const month = moment().month() + 1; // Correction pour obtenir le mois actuel (1-12)
			
			if (!idUser) {
					return res.status(400).json({
							result: false,
							message: "Erreur lors de la récupération de l'utilisateur lors de /users/idUser/income"
					});
			}

			const firstDayOfYear = moment(year, "YYYY").startOf('year').toDate();
			const lastDayOfYear = moment(year, "YYYY").endOf('year').toDate();

			try {
					const incomes = await Income.aggregate([
							{
									$match: {
											user: new mongoose.Types.ObjectId(idUser),
											date: { $gte: firstDayOfYear, $lte: lastDayOfYear }
									}
							},
							{
									$group: {
											_id: { month: { $month: "$date" } },
											totalAmount: { $sum: "$amount" }
									}
							},
							{ $sort: { "_id.month": 1 } }
					]);

					// Crée un tableau avec 12 mois initialisé à 0
					const monthlyIncome = Array.from({ length: 12 }, (_, i) => 0);

					// Remplir le tableau avec les données d'agrégation
					incomes.forEach(income => {
							monthlyIncome[income._id.month - 1] = income.totalAmount;
					});

					res.json({ result: true, income: monthlyIncome });
			} catch (err) {
					res.status(500).json({ result: false, message: 'Erreur du serveur' });
			}
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

		if (!amount) {
			return res.status(400).json({ result: false, message: 'Veuillez rentrer un montant' });
		}

		if (!paymentDate) {
			return res.status(400).json({ result: false, message: 'Veuillez rentrer une date de paiement' });
		}

		// if (new Date(paymentDate).getTime() < today.getTime()) {
		// 	return res.status(400).json({
		// 		result: false,
		// 		message: "Veuillez ne pouvez pas entrer une date de paiement inférieur à la date d'aujourd'hui"
		// 	});
		// }

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
