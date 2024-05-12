const Debt = require('../models/debts');

exports.getDebt = [
	async (req, res) => {
		const idUser = req.user.id;

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/income"
			});
		}

		const debt = await Debt.find({ user: idUser, isPaid: false });

		// console.log(debt)
		if (!debt) {
			return res.status(400).json({
				result: false,
				message: 'Erreur lors de la récuperation de la dette'
			});
		}

		// sum
		let sum = 0;
		debt.forEach((debt) => {
			console.log(debt.amount);
			if (debt.userIsDebtor) {
				sum -= debt.amount;
			} else {
				sum += debt.amount;
			}
			console.log(sum);
		});

		return res.json({ result: true, debts: sum });
	}
];

exports.getAllDebts = [
	async (req, res) => {
		const idUser = req.user.id;

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/income"
			});
		}

		const debts = await Debt.find({ user: idUser, isPaid: false });

		console.log(debts);
		if (!debts) {
			console.log('dedans');
			return res.status(400).json({
				result: false,
				message: 'Erreur lors de la récuperation de la dette'
			});
		}

		const formattedDebts = debts.map((debt) => {
			return {
				id: debt._id,
				amount: debt.amount,
				debtor: debt.debtor,
				userIsDebtor: debt.userIsDebtor,
				isPaid: debt.isPaid
			};
		});

		console.log('resuuult');
		return res.json({ result: true, data: formattedDebts });
	}
];

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

		console.log(debt);

		await debt.save();

		res.status(200).json({ result: true, debt });
	}
];
