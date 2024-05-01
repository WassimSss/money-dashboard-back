const { isNull } = require('lodash');
const Income = require('../models/incomes');
const User = require('../models/users');
const Saving = require('../models/savings');
const Expense = require('../models/expenses');
const Budget = require('../models/budgets');

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

	// console.log(user)

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
	// console.log(allIncomes)
	if (!allIncomes) {
		// return res.status(400).json({ result: false, message: "Erreur lors de la récuperation de tout les incomes" })
		return null;
	}

	// res.status(200).json({ result: true, message: "Ajout de l'income réussie !" })

	console.log(income);
	return income;
};

const getSavingOfUser = async (id) => {
	const user = await findUserById(id);

	// console.log(user)

	if (!user) {
		return null;
	}

	const allSavings = await Saving.find({ user: id });

	let saving = 0;

	for (const oneSaving of allSavings) {
		saving += oneSaving.amount;
	}
	// console.log(allSavings)
	if (!allSavings) {
		// return res.status(400).json({ result: false, message: "Erreur lors de la récuperation de tout les incomes" })
		return null;
	}

	// res.status(200).json({ result: true, message: "Ajout de l'income réussie !" })

	console.log(saving);
	return saving;
};

const getExpensesOfUser = async (id) => {
	const user = await findUserById(id);

	// console.log(user)

	if (!user) {
		return null;
	}

	const allExpenses = await Expense.find({ user: id });

	let expenses = 0;

	for (const oneExpense of allExpenses) {
		expenses += oneExpense.amount;
	}
	// console.log(allExpenses)
	if (!allExpenses) {
		// return res.status(400).json({ result: false, message: "Erreur lors de la récuperation de tout les incomes" })
		return null;
	}

	// res.status(200).json({ result: true, message: "Ajout de l'income réussie !" })

	console.log(expenses);
	return expenses;
};


// Récuperer les dépenses du mois de l'utilisateur et les triers par catégories
const getExpensesByCategory = async (id, period) => {
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

	if (!allExpenses) {
		return null;
	}

	const expensesByCategory = [];

	for (const oneExpense of allExpenses) {
		const existingCategory = expensesByCategory.find((expense) => expense.category === oneExpense.category);

		if (existingCategory) {
			existingCategory.amount += oneExpense.amount;
		} else {
			expensesByCategory.push({ category: oneExpense.category, amount: oneExpense.amount });
		}
	}

	const expensesAmount = allExpenses.reduce((acc, expense) => acc + expense.amount, 0);


	return { expensesByCategory, expensesAmount };
};
/*const sumExpensesOfUser = async (id, expenses) => {
	const user = await findUserById(id);

	// console.log(user)

	if (!user) {
		return null;
	}

	let expenses = 0;

	for (const oneExpense of expenses) {
		expenses += oneExpense.amount;
	}
	// console.log(allExpenses)
	if (!expenses) {
		// return res.status(400).json({ result: false, message: "Erreur lors de la récuperation de tout les incomes" })
		return null;
	}

	// res.status(200).json({ result: true, message: "Ajout de l'income réussie !" })

	console.log(expenses);
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
}


module.exports = { findUserById, getBalanceOfUser, getIncomeOfUser, getSavingOfUser, getExpensesOfUser, getBudgetAmount, getExpensesByCategory };
