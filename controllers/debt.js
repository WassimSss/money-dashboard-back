const Debt = require('../models/debts');
const User = require('../models/users');

// exports.getDebt = [
// 	async (req, res) => {
// 		const idUser = req.user.id;

// 		if (!idUser) {
// 			return res.status(400).json({
// 				result: false,
// 				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/income"
// 			});
// 		}

// 		const debt = await Debt.find({ user: idUser, isPaid: false });

// 		if (!debt) {
// 			return res.status(400).json({
// 				result: false,
// 				message: 'Erreur lors de la récuperation de la dette'
// 			});
// 		}

// 		// sum
// 		let sum = 0;
// 		debt.forEach((debt) => {
// 			if (debt.userIsDebtor) {
// 				sum -= debt.amount;
// 			} else {
// 				sum += debt.amount;
// 			}
// 		});

// 		return res.json({ result: true, debts: sum });
// 	}
// ];

// exports.getAllDebts = [
// 	async (req, res) => {
// 		const idUser = req.user.id;

// 		if (!idUser) {
// 			return res.status(400).json({
// 				result: false,
// 				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/income"
// 			});
// 		}

// 		const debts = await Debt.find({ user: idUser, isPaid: false });

// 		if (!debts) {
// 			return res.status(400).json({
// 				result: false,
// 				message: 'Erreur lors de la récuperation de la dette'
// 			});
// 		}

// 		const formattedDebts = debts.map((debt) => {
// 			return {
// 				id: debt._id,
// 				amount: debt.amount,
// 				debtor: debt.debtor,
// 				userIsDebtor: debt.userIsDebtor,
// 				isPaid: debt.isPaid
// 			};
// 		});

// 		return res.json({ result: true, data: formattedDebts });
// 	}
// ];

exports.deleteDebt = [
	async (req, res) => {
		const idUser = req.user.id;
		const { id } = req.body;

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/income"
			});
		}

		await Debt.deleteOne({ user: idUser, _id: id });

		return res.json({ result: true, message: 'Dette supprimée avec succès !' });
	}
];

exports.addDebt = [
	async (req, res) => {
		const idUser = req.user.id;
		const { amount, debtor, userIsDebtor } = req.body;

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/income"
			});
		}

		const debt = new Debt({
			user: idUser,
			amount,
			userIsDebtor,
			debtor
		});


		await debt.save();

		
		let totalDebt = 0;
		const allDebts = await Debt.find({ user: idUser });
		allDebts.forEach((debt) => {
			totalDebt += debt.amount;
		});

		res.status(200).json({ result: true, debt: totalDebt });
	}
];

exports.acceptDebt = [
	async (req, res) => {
		const idUser = req.user.id;
		const { id } = req.body;

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/income"
			});
		}

		const debt = await Debt.findOne({ user: idUser, _id: id });

		if (!debt) {
			return res.status(400).json({
				result: false,
				message: 'Erreur lors de la récuperation de la dette'
			});
		}

		if (debt.userIsDebtor) {
			// Add debt amount to user balance
			await User.updateOne({ _id: idUser }, { $inc: { balance: -debt.amount } });
		} else {
			// Remove debtor amount from user balance
			await User.updateOne({ _id: idUser }, { $inc: { balance: debt.amount } });
		}

		await Debt.updateOne({ user: idUser, _id: id }, { isPaid: true });

		return res.json({ result: true, message: 'Dette acceptée avec succès !' });
	}
];
