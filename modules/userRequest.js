const { isNull } = require('lodash');
const Income = require('../models/incomes');
const User = require('../models/users')

/**
 * Recherche un utilisateur par son ID dans la base de données.
 *
 * @param {string} id - L'ID de l'utilisateur à rechercher.
 * @returns {Promise<User|null>} L'utilisateur trouvé ou null si aucun utilisateur n'est trouvé.
 */
const findUserById = async (id) => {
    const user = await User.findById(id);

    if (!user) {
        return null
    }

    return user

}

/**
 * Récupère la balance d'un utilisateur à partir de son ID.
 *
 * @param {string} id - L'ID de l'utilisateur dont la balance doit être récupérée.
 * @returns {Promise<number|null>} La balance de l'utilisateur ou null si l'utilisateur n'est pas trouvé ou si la balance n'est pas définie.
 */
const getBalanceOfUser = async (id) => {

    const user = await findUserById(id);

    if (!user) {
        return null
    }

    const balance = user.balance;

    if (!balance && balance !== 0) {
        return null
    }

    return balance
}

const getIncomeOfUser = async (id) => {

    const allIncomes = await Income.find({ user: id });

    if (!allIncomes) {
        // return res.status(400).json({ result: false, message: "Erreur lors de la récuperation de tout les incomes" })
        return null

    }

    console.log(allIncomes)
    // res.status(200).json({ result: true, message: "Ajout de l'income réussie !" })

    return balance
}

module.exports = { findUserById, getBalanceOfUser, getIncomeOfUser }
