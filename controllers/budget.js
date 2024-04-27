const { findUserById, getBalanceOfUser } = require('../modules/userRequest');

exports.getBalance = [
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