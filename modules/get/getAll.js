// exemple :
// dataType : expenses
const getAll = async (req, res, dataType) => {
	let DataModel;
	let Schema;
	let Income;
	let Expense;
	if (dataType !== 'balance') {
		DataModel = require(`../../models/${dataType}`);
		Schema = DataModel.schema.paths;
	} else {
		Income = require('../../models/incomes');
		Expense = require('../../models/expenses');
	}
	const moment = require('moment');
	const idUser = req.user.id;
	const { period, periodNumber, year } = req.params;

	if (!idUser) {
		return res.status(400).json({
			result: false,
			message: `Erreur lors de la récuperation de l'utilisateur lors de /users/${dataType}/get-all`
		});
	}

	let startDate, endDate;
	let dayNumber = moment().dayOfYear();
	let weekNumber = moment().week();
	let monthNumber = moment().add(1, 'month').month();
	let yearNumber = moment().year();

	if (period === 'day') {
		periodNumber && (dayNumber = periodNumber);
		startDate = moment(dayNumber, 'DDD DDDD').format();
		endDate = moment(startDate).endOf('day').format();
	} else if (period === 'week') {
		periodNumber && (weekNumber = periodNumber);
		startDate = moment(weekNumber, 'w ww').format('YYYY-MM-DD');
		endDate = moment(startDate).endOf('week').format('YYYY-MM-DD');
	} else if (period === 'month') {
		periodNumber && (monthNumber = periodNumber);
		startDate = moment(`${monthNumber}-01-${year}`, 'MM-DD-YYYY').format('YYYY-MM-DD');
		endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');
	} else if (period === 'year') {
		periodNumber && (yearNumber = periodNumber);
		startDate = moment(yearNumber, 'YYYY').format('YYYY-MM-DD');
		endDate = moment(startDate).endOf('year').format('YYYY-MM-DD');
	} else {
		return res.status(400).json({ result: false, message: 'Période invalide' });
	}


	const query = {
		user: idUser
	};

	let data = [];

	if (Schema && Schema.date) {
		query.date = {
			$gte: startDate,
			$lte: endDate
		};
	}

	console.log(dataType);
	if (dataType === 'incomes') {
		query.status = 'pending';
	}

	if (dataType !== 'balance') {
		if (Schema.category) {
			console.log('yo 3 ', query);

			data = await DataModel.find(query).populate('category');
		} else if (Schema.user) {
			console.log('yo 2 ');
			data = await DataModel.find(query).populate('user');
		} else {
			data = await DataModel.find(query);
			console.log('yo');
		}
	} else {
		data = await Income.find({
			user: idUser,
			status: 'accepted',
			date: {
				$gte: startDate,
				$lte: endDate
			}
		}).populate('category');
		let test = await Expense.find({
			user: idUser,
			date: {
				$gte: startDate,
				$lte: endDate
			}
		}).populate('category');

		data.push(...test);
	}


	if (!data) {
		return res.status(400).json({ result: false, message: 'Erreur lors de la récuperation des dépenses' });
	}

	let formattedData = data.map((oneData) => {
		return {
			id: oneData['_id'] ? oneData['_id'] : null,
			// user: oneDate.user ? oneData.user : null,
			userIsDebtor: oneData.userIsDebtor ? oneData.userIsDebtor : null,
			debtor: oneData.debtor ? oneData.debtor : null,
			isPaid: oneData.isPaid ? oneData.isPaid : null,
			amount: oneData.amount ? oneData.amount : null,
			type: oneData.type ? oneData.type : null,
			category: oneData.category && oneData.category.category ? oneData.category.category : null,
			description: oneData.description ? oneData.description : null,
			date: oneData.date ? oneData.date : null,
			source: oneData.source ? oneData.source : null,
			expensesMethod: oneData.expensesMethod ? oneData.expensesMethod : null,
			savingMethod: oneData.savingMethod ? oneData.savingMethod : null,
			paymentMethod: oneData.paymentMethod ? oneData.paymentMethod : null,
			frequency: oneData.frequency ? oneData.frequency : null,
			status: oneData.status ? oneData.status : null
		};
	});


	formattedData.sort((a, b) => moment(b.date).diff(moment(a.date)));

	// res.json({ result: true, data: [] })
	res.json({ result: true, data: formattedData });
};

module.exports = getAll;
