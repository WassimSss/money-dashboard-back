const Budget = require('../models/budgets');
const Expense = require('../models/expenses');
const { getBudgetAmount, getExpensesByCategory } = require('../modules/userRequest');

// Recuperer le budget d'un utilisateur
exports.getBudget = [
	async (req, res) => {
		const idUser = req.user.id;
		const { period, periodNumber } = req.params;

		console.log(idUser)
		const budgetAmount = await getBudgetAmount(idUser, period,);

		const expensesByCategory = await getExpensesByCategory(idUser, period, periodNumber);

		console.log("expensesByCategory : ", expensesByCategory)
		if (!budgetAmount && budgetAmount !== 0) {
			return res
				.status(400)
				.json({ result: false, message: 'Erreur lors de la récuperation du budget' });
		}



		res.status(200).json({ result: true, budgetAmount, expensesByCategory: expensesByCategory.expensesByCategory, expensesAmount: expensesByCategory.expensesAmount });
	}
]


// Modifier le budget d'un utilisateur
exports.setBudget = [
	async (req, res) => {
		const idUser = req.user.id;
		const { monthAmount } = req.body;

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/budget"
			});
		}

		console.log(idUser)
		// si l'utilisateur a déjà un budget, ajouter le budget
		let budget = await Budget.findOne({ user: idUser });

		if (budget) {
			const updatedBudget = await Budget.findOneAndUpdate(
				{ user: idUser },
				{ month_amount: monthAmount },
				{ new: true });

			budget = await updatedBudget.save();

		} else {
			// Récuperer les dépenses de l'utilisateur
			const expenses = await Expense.find({ user: idUser });

			const newBudget = new Budget({
				user: idUser,
				month_amount: monthAmount,
				expenses
			});

			budget = await newBudget.save();
		}

		res.json({ result: true, budget });
	}
]
