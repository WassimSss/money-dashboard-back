const Expense = require('../models/expenses');
const { findUserById, getExpensesOfUser } = require('../modules/userRequest');

exports.getExpensesAmount = [
	async (req, res) => {
		const idUser = req.user.id;

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/balance"
			});
		}

		const expenses = await getExpensesOfUser(idUser);
		console.log('in serv ', expenses);
		if (!expenses && expenses !== 0) {
			return res
				.status(400)
				.json({ result: false, message: 'Erreur lors de la récuperation de tout les revenus' });
		}
		// const allIncomes = await User.find({ user: idUser });

		// if (!allIncomes) {

		// }

		res.status(200).json({ result: true, expenses });
	}
];

exports.getAllExpenses = [
	async (req, res) => {
		const idUser = req.user.id;

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/expenses"
			});
		}

		const expenses = await Expense.find({ user: idUser });

		expenses.sort((a, b) => {
			return new Date(b.date) - new Date(a.date);
		});

		res.json({ result: true, expenses });
	}
];

exports.addExpenses = [
	async (req, res) => {
		const idUser = req.user.id;
		const today = new Date();

		console.log('expensesDate : ', req.body.expensesDate);
		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/expenses"
			});
		}

		const { amount, category, description, expensesDate, source, expensesMethod, frequency, status } = req.body;

		console.log('expensesDate : ', expensesDate);

		if (!amount) {
			return res.status(400).json({ result: false, message: 'Veuillez rentrer un montant' });
		}

		if (!expensesDate) {
			return res.status(400).json({ result: false, message: 'Veuillez rentrer une date de dépense' });
		}

		// if (new Date(paymentDate).getTime() < today.getTime()) {
		//     return res.status(400).json({ result: false, message: "Veuillez ne pouvez pas entrer une date de paiement inférieur à la date d'aujourd'hui" })

		// };:

		const newExpenses = new Expense({
			user: idUser,
			amount,
			category,
			description,
			date: expensesDate,
			source,
			expensesMethod,
			frequency,
			status
		});

		const expenses = await newExpenses.save();

		console.log(expenses);

		if (!expenses) {
			res.status(400).json({ result: false, message: 'Erreur lors de la création de la dépense' });
		}

		const sumExpenses = await getExpensesOfUser(idUser);

		res.status(200).json({ result: true, expenses: sumExpenses, message: 'Ajout de la dépense réussie !' });
	}
];

// delete expenses by req.body.idExpenses

exports.deleteExpenses = [
	async (req, res) => {
		const idUser = req.user.id;
		const { idExpenses } = req.body;

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/expenses"
			});
		}

		if (!idExpenses) {
			return res.status(400).json({ result: false, message: 'Veuillez rentrer un id de dépense' });
		}

		const expenses = await Expense.findByIdAndDelete(idExpenses);

		if (!expenses) {
			return res.status(400).json({ result: false, message: 'Erreur lors de la suppression de la dépense' });
		}

		res.status(200).json({ result: true, message: 'Suppression de la dépense réussie !' });
	}
];
