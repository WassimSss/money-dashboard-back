const { default: mongoose } = require('mongoose');
const Expense = require('../models/expenses');
const ExpensesCategory = require('../models/expensesCategories');
const Income = require('../models/incomes');
const User = require('../models/users');
const { findUserById, getExpensesOfUser } = require('../modules/userRequest');
const moment = require('moment');

// exports.getExpensesAmount = [
// 	async (req, res) => {
// 		const idUser = req.user.id;

// 		if (!idUser) {
// 			return res.status(400).json({
// 				result: false,
// 				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/balance"
// 			});
// 		}

// 		const expenses = await getExpensesOfUser(idUser);
// 		if (!expenses && expenses !== 0) {
// 			return res
// 				.status(400)
// 				.json({ result: false, message: 'Erreur lors de la récuperation de tout les revenus' });
// 		}

// 		res.status(200).json({ result: true, expenses });
// 	}
// ];

// exports.getAllExpenses = [
// 	async (req, res) => {
// 		const idUser = req.user.id;
// 		const { period, periodNumber, year } = req.params;

// 		if (!idUser) {
// 			return res.status(400).json({
// 				result: false,
// 				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/expenses"
// 			});
// 		}

// 		let startDate, endDate;
// 		let dayNumber = moment().dayOfYear();
// 		let weekNumber = moment().week();
// 		let monthNumber = moment().add(1, 'month').month();
// 		let yearNumber = moment().year();

// 		if (period === 'day') {
// 			periodNumber && (dayNumber = periodNumber);
// 			startDate = moment(dayNumber, 'DDD DDDD').format();
// 			endDate = moment(startDate).endOf('day').format();
// 		} else if (period === 'week') {
// 			periodNumber && (weekNumber = periodNumber);
// 			startDate = moment(weekNumber, 'w ww').format('YYYY-MM-DD');
// 			endDate = moment(startDate).endOf('week').format('YYYY-MM-DD');
// 		} else if (period === 'month') {
// 			periodNumber && (monthNumber = periodNumber);
// 			startDate = moment(`${monthNumber}-01-${year}`, 'MM-DD-YYYY').format('YYYY-MM-DD');
// 			endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');
// 		} else if (period === 'year') {
// 			periodNumber && (yearNumber = periodNumber);
// 			startDate = moment(yearNumber, 'YYYY').format('YYYY-MM-DD');
// 			endDate = moment(startDate).endOf('year').format('YYYY-MM-DD');
// 		} else {
// 			return res.status(400).json({ result: false, message: 'Période invalide' });
// 		}


// 		const expenses = await Expense.find({
// 			user: idUser,
// 			date: {
// 				$gte: startDate,
// 				$lte: endDate
// 			}
// 		}).populate('category');

// 		if (!expenses) {
// 			return res.status(400).json({ result: false, message: 'Erreur lors de la récuperation des dépenses' });
// 		}

// 		const formattedExpenses = expenses.map((expense) => {
// 			return {
// 				id: expense._id,
// 				amount: expense.amount,
// 				category: expense.category.category,
// 				description: expense.description,
// 				date: expense.date,
// 				source: expense.source,
// 				expensesMethod: expense.expensesMethod,
// 				frequency: expense.frequency,
// 				status: expense.status
// 			};
// 		});

// 		// res.json({ result: true, data: [] })
// 		res.json({ result: true, data: formattedExpenses });
// 	}
// ];

exports.getExpensesByPeriod = [
	async (req, res) => {
			const idUser = req.user.id;
			const { period, periodNumber, year } = req.params;

			if (!idUser) {
					return res.status(400).json({
							result: false,
							message: "Erreur lors de la récupération de l'utilisateur lors de /users/idUser/expenses"
					});
			}

			let startDate, endDate;
			const currentYear = moment().year();

			switch (period) {
					case 'day':
							startDate = moment().dayOfYear(periodNumber || moment().dayOfYear()).startOf('day').toDate();
							endDate = moment(startDate).endOf('day').toDate();
							break;
					case 'week':
							startDate = moment().week(periodNumber || moment().week()).startOf('week').toDate();
							endDate = moment(startDate).endOf('week').toDate();
							break;
					case 'month':
							startDate = moment({ year: year || currentYear, month: (periodNumber || moment().month()) - 1 }).startOf('month').toDate();
							endDate = moment(startDate).endOf('month').toDate();
							break;
					case 'year':
							startDate = moment({ year: periodNumber || currentYear }).startOf('year').toDate();
							endDate = moment(startDate).endOf('year').toDate();
							break;
					default:
							return res.status(400).json({ result: false, message: 'Période invalide' });
			}

			try {
					let expenses;
					if (period === 'year') {
							expenses = await Expense.aggregate([
									{ $match: { user: new mongoose.Types.ObjectId(idUser), date: { $gte: startDate, $lte: endDate } } },
									{ $group: { _id: { month: { $month: "$date" } }, total: { $sum: "$amount" } } },
									{ $sort: { "_id.month": 1 } }
							]);
							const expensesOfAllMonths = Array.from({ length: 12 }, (_, i) => {
									const monthData = expenses.find(e => e._id.month === i + 1);
									return monthData ? monthData.total : 0;
							});

							return res.status(200).json({ result: true, expenses: expensesOfAllMonths });
					} else {
							expenses = await Expense.find({ user: idUser, date: { $gte: startDate, $lte: endDate } }).lean();

							if (!expenses) {
									return res.status(400).json({ result: false, message: 'Erreur lors de la récupération des dépenses' });
							}

							const categories = await ExpensesCategory.find({ _id: { $in: expenses.map(e => e.category) } }).lean();
							const categoriesMap = categories.reduce((acc, category) => {
									acc[category._id] = category.category;
									return acc;
							}, {});

							const expensesByCategory = expenses.reduce((acc, expense) => {
									const categoryName = categoriesMap[expense.category] || 'Unknown';
									acc[categoryName] = (acc[categoryName] || 0) + expense.amount;
									return acc;
							}, {});

							const sortedExpensesByCategory = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]);

							const top3ExpensesByCategory = sortedExpensesByCategory.slice(0, 3);
							const otherExpensesAmount = sortedExpensesByCategory.slice(3).reduce((acc, expense) => acc + expense[1], 0);

							let amountExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);

							if (otherExpensesAmount === 0)
									return res.status(200).json({ result: true, expenses: top3ExpensesByCategory, amount: amountExpenses });

							const top3ExpensesByCategoryWithOther = [...top3ExpensesByCategory, ['Autre', otherExpensesAmount]];

							res.status(200).json({ result: true, expenses: top3ExpensesByCategoryWithOther, amount: amountExpenses });
					}
			} catch (err) {
				console.error(err);
					res.status(500).json({ result: false, message: 'Erreur du serveur' });
			}
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

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/expenses"
			});
		}

		console.log(req.body);
		const { amount, category, description, expensesDate, source, expensesMethod, frequency, status, changeBalanceAmount } = req.body;

		if (!amount) {
			return res.status(400).json({ result: false, message: 'Veuillez rentrer un montant' });
		}

		if (!moment.isDate(expensesDate)) {
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

		// and update the user balance
		if(changeBalanceAmount){
			await User.updateOne({ _id: idUser }, { $inc: { balance: -amount } });
		}

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