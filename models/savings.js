const mongoose = require('mongoose');

// Schéma pour les revenus
const savingSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users', // Référence à la collection des utilisateurs
		required: true
	},
	amount: {
		type: Number,
		required: true
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ExpensesCategory', // Référence à la collection des catégories de dépenses
		default: null
	},
	description: {
		type: String,
		default: ''
	},
	date: {
		type: Date
		// default: Date.now
	},
	source: {
		type: String,
		default: ''
	},
	savingMethod: {
		type: String,
		default: ''
	},
	frequency: {
		type: String,
		default: ''
	},
	status: {
		type: String,
		default: ''
	}
});

// Modèle pour les revenus
const Saving = mongoose.model('Saving', savingSchema);

module.exports = Saving;
