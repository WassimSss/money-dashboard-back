const Expense = require('../models/expenses');
const Income = require('../models/incomes');
const User = require('../models/users');
const { findUserById, getBalanceOfUser } = require('../modules/userRequest');

exports.getBalanceAmount = [
	async (req, res) => {
		const idUser = req.user.id;

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/balance"
			});
		}

		const balanceUser = await getBalanceOfUser(idUser);

		console.log(balanceUser);
		if (!balanceUser && balanceUser !== 0) {
			return res.status(400).json({
				result: false,
				message: 'Erreur lors de la récuperation de balance lors de /users/idUser/balance'
			});
		}

		res.json({ result: true, balance: balanceUser });
	}
];

// Récuperer toutes les virements et prelevement de l'utilisateur une fois qu'ils ont été validé (status: accepted)
// ainsi que ses achats (expenses) et les trier par date
exports.getAllBalance = [
	async (req, res) => {
		const idUser = req.user.id;

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/balance"
			});
		}

		// stocker les virements/prelevement et les achats de l'utilisateur

		const balancesAndExpenses = [];

		const balance = await Income.find({ user: idUser, status: 'accepted' }).populate('category');

		balancesAndExpenses.push(...balance);

		const expenses = await Expense.find({ user: idUser }).populate('category');

		balancesAndExpenses.push(...expenses);

		const formattedBalancesAndExpenses = balancesAndExpenses.map((balance) => {
			if(balance.type){
				console.log(balance)
			}
			return {
				id: balance._id,
				amount: balance.amount,
				category: balance.category.category,
				description: balance.description,
				date: balance.date,
				source: balance.source,
				balancesMethod: balance.balancesMethod,
				frequency: balance.frequency,
				status: balance.status
			};
		});
		// console.log(balancesAndExpenses);

		res.json({ result: true, history: formattedBalancesAndExpenses });
	}
];

exports.setBalance = [
	async (req, res) => {
		const idUser = req.user.id;

		if (!idUser) {
			return res.status(400).json({ result: false, message: "Erreur lors de l'ajout de la somme" });
		}

		const { amount } = req.body;

		if (!amount) {
			return res.status(400).json({ result: false, message: 'Veuillez rentrer un montant' });
		}

		const user = await User.findByIdAndUpdate(idUser, { balance: amount }, { new: true });

		if (!user) {
			return res.status(404).json({ result: false, message: 'Utilisateur non trouvé' });
		}

		console.log(user);

		res.status(200).json({ result: true, balance: user.balance, message: 'Ajout de la somme réussie !' });
	}
];
