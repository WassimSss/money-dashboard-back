const { findUserById, getBalanceOfUser } = require('../modules/userRequest');


exports.getBalance = [
	async (req, res) => {

		const idUser = req.user.id;

		if(!idUser){
			return res.status(400).json({result: false, message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/balance"})
		}

		const balanceUser = await getBalanceOfUser(idUser);

		console.log(balanceUser)
		if(!balanceUser && balanceUser !== 0){
			return res.status(400).json({result: false, message: "Erreur lors de la récuperation de balance lors de /users/idUser/balance"})
		}

		res.json({ result: true, balance: balanceUser })
	}
]