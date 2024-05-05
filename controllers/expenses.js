const Expense = require('../models/expenses');
const ExpensesCategory = require('../models/expensesCategories');
const Income = require('../models/incomes');
const { findUserById, getExpensesOfUser } = require('../modules/userRequest');
const moment = require('moment');

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

		res.status(200).json({ result: true, expenses });
	}
];

exports.getAllExpenses = [
	async (req, res) => {
		const idUser = req.user.id;
		const { period, periodNumber } = req.params;


		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/expenses"
			});
		}

		let startDate, endDate;
		let dayNumber = moment().dayOfYear();
		let weekNumber = moment().week();
		let monthNumber = moment().add(1, 'month').month();
		let yearNumber = moment().year();

		if (period === 'day') {
			periodNumber && (dayNumber = periodNumber);
			startDate = moment(dayNumber, 'DDD DDDD').format();
			endDate = moment(startDate).endOf('day').format();

		} else if (period === 'week') {
			periodNumber && (weekNumber = periodNumber);
			startDate = moment(weekNumber, 'w ww').format('YYYY-MM-DD');
			endDate = moment(startDate).endOf('week').format('YYYY-MM-DD');

		} else if (period === 'month') {
			periodNumber && (monthNumber = periodNumber);
			startDate = moment(monthNumber, 'M MM').format('YYYY-MM-DD');
			endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');

		} else if (period === 'year') {
			periodNumber && (yearNumber = periodNumber);
			startDate = moment(yearNumber, 'YYYY').format('YYYY-MM-DD');
			endDate = moment(startDate).endOf('year').format('YYYY-MM-DD');
		} else {
			return res.status(400).json({ result: false, message: 'Période invalide' });
		}

		const expenses = await Expense.find({
			user: idUser,
			date: {
				$gte: startDate,
				$lte: endDate
			}
		}).populate('category');

		if (!expenses) {
			return res.status(400).json({ result: false, message: 'Erreur lors de la récuperation des dépenses' });
		}

		const formattedExpenses = expenses.map((expense) => {
			return {
				id: expense._id,
				amount: expense.amount,
				category: expense.category.category,
				description: expense.description,
				date: expense.date,
				source: expense.source,
				expensesMethod: expense.expensesMethod,
				frequency: expense.frequency,
				status: expense.status
			};
		});

		res.json({ result: true, expenses: formattedExpenses });
	}
];

exports.getExpensesByPeriod = [
	async (req, res) => {
		const idUser = req.user.id;
		console.log(idUser);
		const { period, periodNumber } = req.params;

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/expenses"
			});
		}

		let startDate, endDate;
		let dayNumber = moment().dayOfYear();
		let weekNumber = moment().week();
		let monthNumber = moment().add(1, 'month').month();
		let yearNumber = moment().year();

		if (period === 'day') {
			periodNumber && (dayNumber = periodNumber);
			startDate = moment(dayNumber, 'DDD DDDD').format();
			endDate = moment(startDate).endOf('day').format();

		} else if (period === 'week') {
			periodNumber && (weekNumber = periodNumber);
			startDate = moment(weekNumber, 'w ww').format();
			endDate = moment(startDate).endOf('week').format('YYYY-MM-DD');
			console.log('startDate : ', startDate);
			console.log('endDate : ', endDate);

		} else if (period === 'month') {
			periodNumber && (monthNumber = periodNumber);
			startDate = moment(monthNumber, 'M MM').format('YYYY-MM-DD');
			endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');

		} else if (period === 'year') {
			periodNumber && (yearNumber = periodNumber);
			startDate = moment(yearNumber, 'YYYY').format('YYYY-MM-DD');
			endDate = moment(startDate).endOf('year').format('YYYY-MM-DD');
		} else {
			return res.status(400).json({ result: false, message: 'Période invalide' });
		}

		const expenses = await Expense.find({
			user: idUser,
			date: {
				$gte: startDate,
				$lte: endDate
			}
		});

		if (!expenses) {
			return res.status(400).json({ result: false, message: 'Erreur lors de la récuperation des dépenses' });
		}

		const expensesByCategory = {};
		for (const expense of expenses) {
			const category = await ExpensesCategory.findById(expense.category);
			const categoryName = category.category;
			const categoryAmount = expense.amount;
			if (expensesByCategory[categoryName]) {
				expensesByCategory[categoryName] += categoryAmount;
			} else {
				expensesByCategory[categoryName] = categoryAmount;
			}
		}

		const sortedExpensesByCategory = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]);

		const top3ExpensesByCategory = sortedExpensesByCategory.slice(0, 3);

		const otherExpenses = sortedExpensesByCategory.slice(3);

		const otherExpensesAmount = otherExpenses.reduce((acc, expense) => acc + expense[1], 0);

		let amountExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);

		if (otherExpensesAmount === 0) return res.status(200).json({ result: true, expenses: top3ExpensesByCategory, amount : amountExpenses });

		const top3ExpensesByCategoryWithOther = [ ...top3ExpensesByCategory, [ 'Autre', otherExpensesAmount ] ];

		res.status(200).json({ result: true, expenses: top3ExpensesByCategoryWithOther, amount : amountExpenses });
	}
];

// Filtrer les dépenses en fonctions de la catégories, sortir les 3 catégories avec le plus de dépenses, et mettre le reste dans une catégories autre
exports.getExpensesByCategory = [
	async (req, res) => {
		const idUser = req.user.id;
		const { period } = req.params;

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/expenses"
			});
		}

		const today = new Date();
		let startDate, endDate;

		if (period === 'day') {
			startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
			endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
		} else if (period === 'week') {
			const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
			const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7));
			startDate = new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate());
			endDate = new Date(lastDayOfWeek.getFullYear(), lastDayOfWeek.getMonth(), lastDayOfWeek.getDate());
		} else if (period === 'month') {
			const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
			const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
			startDate = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), firstDayOfMonth.getDate());
			endDate = new Date(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth(), lastDayOfMonth.getDate());
		} else {
			return res.status(400).json({ result: false, message: 'Période invalide' });
		}

		const expenses = await Expense.find({
			user: idUser,
			date: {
				$gte: startDate,
				$lte: endDate
			}
		});

		if (!expenses) {
			return res.status(400).json({ result: false, message: 'Erreur lors de la récuperation des dépenses' });
		}

		console.log('expenses :', expenses);

		const expensesByCategory = [];
		for (const expense of expenses) {
			const category = await ExpensesCategory.findById(expense.category);
			const categoryName = category.category;
			const categoryAmount = expense.amount;
			if (expensesByCategory[categoryName]) {
				expensesByCategory[categoryName] += categoryAmount;
			} else {
				expensesByCategory[categoryName] = categoryAmount;
			}
		}

		console.log('expensesByCategory : ', expensesByCategory);

		const sortedExpensesByCategory = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]);

		const top3ExpensesByCategory = sortedExpensesByCategory.slice(0, 3);

		const otherExpenses = sortedExpensesByCategory.slice(3);

		const otherExpensesAmount = otherExpenses.reduce((acc, expense) => acc + expense[1], 0);

		if (otherExpensesAmount === 0) return res.status(200).json({ result: true, expenses: top3ExpensesByCategory });

		const top3ExpensesByCategoryWithOther = [ ...top3ExpensesByCategory, [ 'Autre', otherExpensesAmount ] ];

		res.status(200).json({ result: true, expenses: top3ExpensesByCategoryWithOther });
	}
];

exports.addExpenses = [
	async (req, res) => {
		const idUser = req.user.id;
		const today = new Date();

		console.log('expensesDate : ', req.body);
		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/expenses"
			});
		}

		const { amount, category, description, expensesDate, source, expensesMethod, frequency, status } = req.body;

		console.log(req.body);
		console.log('expensesDate : ', expensesDate);

		if (!amount) {
			return res.status(400).json({ result: false, message: 'Veuillez rentrer un montant' });
		}

		if (!expensesDate) {
			return res.status(400).json({ result: false, message: 'Veuillez rentrer une date de dépense' });
		}

		if (new Date(expensesDate).getTime() > today.getTime()) {
			return res.status(400).json({
				result: false,
				message: "Veuillez ne pouvez pas entrer une date de paiement supérieur à la date d'aujourd'hui"
			});
		}

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

		console.log(req.body);
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
