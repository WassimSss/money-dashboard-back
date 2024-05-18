const Saving = require('../models/savings');
const { findUserById, getIncomeOfUser, getSavingOfUser } = require('../modules/userRequest');

exports.getSavingAmount = [
	async (req, res) => {
		const idUser = req.user.id;

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/balance"
			});
		}

		const saving = await getSavingOfUser(idUser);
		if (!saving && saving !== 0) {
			return res
				.status(400)
				.json({ result: false, message: 'Erreur lors de la récuperation de tout les revenus' });
		}
		// const allIncomes = await User.find({ user: idUser });

		// if (!allIncomes) {

		// }

		res.status(200).json({ result: true, saving });
	}
];

exports.getAllSaving = [
	async (req, res) => {
		const idUser = req.user.id;

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/saving"
			});
		}

		const saving = await Saving.find({ user: idUser }).populate('category');

		saving.sort((a, b) => {
			return new Date(b.date) - new Date(a.date);
		});

		console.log(saving[0]);

		const formattedSaving = saving.map((saving) => {
			return {
				id: saving._id,
				amount: saving.amount,
				category: saving.category.category,
				description: saving.description,
				savingDate: saving.savingDate,
				source: saving.source,
				savingMethod: saving.savingMethod,
				frequency: saving.frequency,
				status: saving.status
			};
		});

		res.json({ result: true, data: formattedSaving });
	}
];

exports.addSaving = [
	async (req, res) => {
		const idUser = req.user.id;
		const today = new Date();

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/saving"
			});
		}

		const { amount, category, description, savingDate, source, savingMethod, frequency, status, changeBalanceAmount } = req.body;

		if (!amount) {
			return res.status(400).json({ result: false, message: 'Veuillez rentrer un montant' });
		}

		if (!savingDate) {
			return res.status(400).json({ result: false, message: "Veuillez rentrer une date d'économie" });
		}

		// if (new Date(paymentDate).getTime() < today.getTime()) {
		//     return res.status(400).json({ result: false, message: "Veuillez ne pouvez pas entrer une date de paiement inférieur à la date d'aujourd'hui" })

		// };:

		const newSaving = new Saving({
			user: idUser,
			amount,
			category,
			description,
			savingDate,
			source,
			savingMethod,
			frequency,
			status
		});

		const saving = await newSaving.save();

		if (!saving) {
			res.status(400).json({ result: false, message: "Erreur lors de la création de l'economie" });
		}

		if(changeBalanceAmount) {
			const user = await findUserById(idUser);
			if (!user) {
				return res.status(400).json({ result: false, message: "Erreur lors de la récuperation de l'utilisateur" });
			}
			const newBalance = user.balance - amount;
			user.balance = newBalance;
			await user.save();
		}
		
		const sumSaving = await getSavingOfUser(idUser);


		res.status(200).json({ result: true, saving: sumSaving, message: "Ajout de l'economie réussie !" });
	}
];

// delete id with req.body.idSaving
exports.deleteSaving = [
	async (req, res) => {
		const idUser = req.user.id;
		const idSaving = req.body.idSaving;

		if (!idUser) {
			return res.status(400).json({
				result: false,
				message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/saving"
			});
		}

		if (!idSaving) {
			return res
				.status(400)
				.json({ result: false, message: "Erreur lors de la récuperation de l'id de l'economie" });
		}

		const saving = await Saving.findByIdAndDelete(idSaving);

		if (!saving) {
			return res.status(400).json({ result: false, message: "Erreur lors de la suppression de l'economie" });
		}

		res.status(200).json({ result: true, message: "Suppression de l'economie réussie !" });
	}
];
