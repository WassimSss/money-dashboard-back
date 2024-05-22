const { isNull } = require('lodash');
const Income = require('../models/incomes');
const User = require('../models/users');
const Saving = require('../models/savings');
const Expense = require('../models/expenses');
const Budget = require('../models/budgets');
const ExpensesCategory = require('../models/expensesCategories');
const moment = require('moment');
const { default: mongoose } = require('mongoose');
/**
 * Recherche un utilisateur par son ID dans la base de données.
 *
 * @param {string} id - L'ID de l'utilisateur à rechercher.
 * @returns {Promise<User|null>} L'utilisateur trouvé ou null si aucun utilisateur n'est trouvé.
 */
const findUserById = async (id) => {
	const user = await User.findById(id);

	if (!user) {
		return null;
	}

	return user;
};

/**
 * Récupère la balance d'un utilisateur à partir de son ID.
 *
 * @param {string} id - L'ID de l'utilisateur dont la balance doit être récupérée.
 * @returns {Promise<number|null>} La balance de l'utilisateur ou null si l'utilisateur n'est pas trouvé ou si la balance n'est pas définie.
 */
const getBalanceOfUser = async (id) => {
	const user = await findUserById(id);

	if (!user) {
		return null;
	}

	const balance = user.balance;

	if (!balance && balance !== 0) {
		return null;
	}

	return balance;
};

const getIncomeOfUser = async (id) => {
	const user = await findUserById(id);


	if (!user) {
		return null;
	}

	const allIncomes = await Income.find({ user: id, status: 'pending' });

	let income = 0;

	for (const oneIncome of allIncomes) {
		if (oneIncome.type === 'virement') {
			income += oneIncome.amount;
		} else {
			income -= oneIncome.amount;
		}
	}
	if (!allIncomes) {
		// return res.status(400).json({ result: false, message: "Erreur lors de la récuperation de tout les incomes" })
		return null;
	}

	// res.status(200).json({ result: true, message: "Ajout de l'income réussie !" })

	return income;
};

const getSavingOfUser = async (id) => {
	const user = await findUserById(id);


	if (!user) {
		return null;
	}

	const allSavings = await Saving.find({ user: id });

	let saving = 0;

	for (const oneSaving of allSavings) {
		saving += oneSaving.amount;
	}
	if (!allSavings) {
		// return res.status(400).json({ result: false, message: "Erreur lors de la récuperation de tout les incomes" })
		return null;
	}

	// res.status(200).json({ result: true, message: "Ajout de l'income réussie !" })

	return saving;
};

const getExpensesOfUser = async (id) => {
	const user = await findUserById(id);


	if (!user) {
		return null;
	}

	const today = new Date();
	const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
	const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

	const allExpenses = await Expense.find({
		user: id,
		date: {
			$gte: new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), firstDayOfMonth.getDate()),
			$lte: new Date(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth(), lastDayOfMonth.getDate())
		}
	});

	let expenses = 0;

	for (const oneExpense of allExpenses) {
		expenses += oneExpense.amount;
	}
	if (!allExpenses) {
		// return res.status(400).json({ result: false, message: "Erreur lors de la récuperation de tout les incomes" })
		return null;
	}

	// res.status(200).json({ result: true, message: "Ajout de l'income réussie !" })

	return expenses;
};

// Récuperer les dépenses du mois de l'utilisateur et les triers par catégories
const getExpensesByCategory = async (id, period, periodNumber, year) => {
	const user = await findUserById(id);

	if (!user) {
			return null;
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
					return { result: false, message: 'Période invalide' };
	}

	try {
			const allExpenses = await Expense.aggregate([
					{ $match: { user: new mongoose.Types.ObjectId(id), date: { $gte: startDate, $lte: endDate } } },
					{ 
							$group: {
									_id: "$category",
									totalAmount: { $sum: "$amount" }
							}
					},
					{
							$lookup: {
									from: "expensescategories", // collection name in MongoDB
									localField: "_id",
									foreignField: "_id",
									as: "categoryDetails"
							}
					},
					{ $unwind: "$categoryDetails" },
					{
							$project: {
									categoryName: "$categoryDetails.category",
									categoryBudget: "$categoryDetails.budget",
									categoryAmount: "$totalAmount"
							}
					}
			]);

			const expensesAmount = allExpenses.reduce((acc, expense) => acc + expense.categoryAmount, 0);

			return { expensesByCategory: allExpenses, expensesAmount };
	} catch (err) {
			console.error(err);
			return { result: false, message: 'Erreur du serveur' };
	}
};
/*const sumExpensesOfUser = async (id, expenses) => {
	const user = await findUserById(id);


	if (!user) {
		return null;
	}

	let expenses = 0;

	for (const oneExpense of expenses) {
		expenses += oneExpense.amount;
	}
	if (!expenses) {
		// return res.status(400).json({ result: false, message: "Erreur lors de la récuperation de tout les incomes" })
		return null;
	}

	// res.status(200).json({ result: true, message: "Ajout de l'income réussie !" })

	return expenses;

}
*/

// getBudgetAmount

const getBudgetAmount = async (id, period) => {
	const user = await findUserById(id);

	if (!user) {
		return null;
	}

	const budget = await Budget.findOne({ user: id });

	if (!budget) {
		return null;
	}

	return budget[`${period}_amount`];
};

const getMonthBudgetAmount = async (id, month, year) => {
	const user = await findUserById(id);

	if (!user) {
		return null;
	}

	const budget = await Budget.findOne({ user: id, period: `${month}-${year}` });

	if (!budget) {
		return null;
	}

	return budget[`period_amount`];
};

module.exports = {
	findUserById,
	getBalanceOfUser,
	getIncomeOfUser,
	getSavingOfUser,
	getExpensesOfUser,
	getBudgetAmount,
	getExpensesByCategory,
	getMonthBudgetAmount
};
