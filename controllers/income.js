const Income = require('../models/incomes');
const { findUserById, getIncomeOfUser } = require('../modules/userRequest');

exports.getAllIncome = [
    async (req, res) => {

        getIncomeOfUser()
        // const idUser = req.user.id;

        // if (!idUser) {
        //     return res.status(400).json({ result: false, message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/balance" })
        // }

        // const allIncomes = await User.find({ user: idUser });

        // if (!allIncomes) {
        //     return res.status(400).json({ result: false, message: "Erreur lors de la récuperation de tout les incomes" })

        // }

        // res.status(200).json({ result: true, message: "Ajout de l'income réussie !" })

    }
]

exports.addIncome = [
    async (req, res) => {

        const idUser = req.user.id;

        if (!idUser) {
            return res.status(400).json({ result: false, message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/balance" })
        }

        const { amount, category, description, paymentDate, source, paymentMethod, frequency, status } = req.body

        if (!amount) {
            return res.status(400).json({ result: false, message: "Veuillez rentrer un montant" })

        }

        if (!paymentDate) {
            return res.status(400).json({ result: false, message: "Veuillez rentrer une date de paiement" })
        }

        const newIncome = new Income({
            user: idUser,
            amount,
            category,
            description,
            paymentDate: new Date(paymentDate),
            source,
            paymentMethod,
            frequency,
            status
        })

        const income = await newIncome.save();

        console.log(income);

        if (!income) {
            res.status(400).json({ result: false, message: "Erreur lors de la création de l'income" })
        }

        res.status(200).json({ result: true, message: "Ajout de l'income réussie !" })

    }
]

