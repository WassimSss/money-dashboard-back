const Budget = require('../models/budgets');
const Expense = require('../models/expenses');
const { getBudgetAmount, getExpensesByCategory, getMonthBudgetAmount } = require('../modules/userRequest');

// Recuperer le budget d'un utilisateur
exports.getBudget = [
	async (req, res) => {
		const idUser = req.user.id;
		const { period, periodNumber, year } = req.params;

		const budgetAmount = await getBudgetAmount(idUser, period,);

		const expensesByCategory = await getExpensesByCategory(idUser, period, periodNumber, year);

		if (!budgetAmount && budgetAmount !== 0) {
			return res
				.status(400)
				.json({ result: false, message: 'Erreur lors de la récuperation du budget' });
		}



		res.status(200).json({ result: true, budgetAmount, expensesByCategory: expensesByCategory.expensesByCategory, expensesAmount: expensesByCategory.expensesAmount });
	}
]

exports.getMonthBudget = [
	async (req, res) => {
		const idUser = req.user.id;
		const { period, periodNumber, month, year } = req.params;

		let budgetAmount = await getMonthBudgetAmount(idUser, month, year);

		const expensesByCategory = await getExpensesByCategory(idUser, period, month, year);

		console.log("budgetAmount : ", budgetAmount)
		console.log("expensesByCategory : ", expensesByCategory)

		res.status(200).json({ result: true, budgetAmount, expensesByCategory: expensesByCategory.expensesByCategory, expensesAmount: expensesByCategory.expensesAmount });
	}
]


// Modifier le budget d'un utilisateur
exports.setBudget = [
	async (req, res) => {
		const idUser = req.user.id;
		const { monthAmount, month, year } = req.body;
		console.log("req.body : ", req.body)
		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/budget"
			});
		}

		// si l'utilisateur a déjà un budget, ajouter le budget
		let budget = await Budget.findOne({ user: idUser, period: `${month}-${year}` });

		if (budget) {
			budget.period_amount = monthAmount;
			budget.month_amount = monthAmount;

			budget.save();

		} else {

			const newBudget = new Budget({
				user: idUser,
				period: `${month}-${year}`,
				period_amount: monthAmount,
				month_amount: monthAmount,
				// expenses
			});

			budget = await newBudget.save();
		}

		res.json({ result: true, budget });
	}
]
