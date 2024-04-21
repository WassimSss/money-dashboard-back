const mongoose = require('mongoose');

// Schéma pour le budget mensuel
const budgetSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User', // Référence à la collection des utilisateurs
		required: true
	},
	month: {
		type: Number,
		required: true
	},
	// year: {
	// 	type: Number,
	// 	required: true
	// },
	amount: {
		type: Number,
		required: true
	},
	expenses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Expense' // Référence à la collection des dépenses
		}
	]
});

// Modèle pour le budget mensuel
const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
