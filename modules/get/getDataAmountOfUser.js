// exemple :

const Expense = require("../../models/expenses");
const Income = require("../../models/incomes");
const Saving = require("../../models/savings");
const User = require("../../models/users");
const checkUser = require("../checkUser");
const { getBalanceOfUser } = require("../userRequest");
const mongoose = require('mongoose');
const moment = require('moment');
const Debt = require("../../models/debts");
const dataTypes = {
  balance: User,
  incomes: Income,
  savings: Saving,
  expenses: Expense,
  debts: Debt


}
const getDataAmountOfUser = async (idUser, res, dataType) => {

  let dataModel;
  let amount;

  const currentMonth = moment().add('month', 1).month();
  const currentYear = moment().year();
  let group = {_id: null, [dataType]: {$sum : "$amount"}}  

  let startDate;
  let endDate;
  switch (dataType) {
    case 'balance':
      dataModel = dataTypes[dataType];
      amount = await dataModel.findOne({ _id: idUser }).lean().select('balance');
      amount = amount[dataType];
      break;
    default:
      const query = { user: new mongoose.Types.ObjectId(idUser) }
      if(dataType === 'incomes'){
        query.status = 'pending';
        group = {
          _id: null,
          [dataType]: {
              $sum: {
                  $cond: {
                      if: { $eq: ["$type", "virement"] },
                      then: "$amount",
                      else: { $multiply: ["$amount", -1] }
                  }
              }
          }
      }
      } else if(dataType === 'expenses'){
        startDate = moment(`${currentYear}-${currentMonth}-01`).startOf('month').toDate();
        endDate = moment(startDate).endOf('month').toDate();
        
        query.date = { $gte: startDate, $lte: endDate };
      } else if (dataType === 'debts'){
        query.isPaid = false
        group = {
          _id: null,
          [dataType]: {
              $sum: {
                  $cond: {
                      if: { $eq: ["$userIsDebtor", false] },
                      then: "$amount",
                      else: { $multiply: ["$amount", -1] }
                  }
              }
          }
      }
      }
      dataModel = dataTypes[dataType];
      amount = await dataModel.aggregate([
        { $match: query },
        {$group : group },
        
    ]);

    if(amount.length === 0){
      return 0;
    }
    console.log(amount)
    amount = amount[0][dataType];

      break;
  }


  return amount;
}

module.exports = getDataAmountOfUser;
