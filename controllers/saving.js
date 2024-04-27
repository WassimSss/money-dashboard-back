const Saving = require('../models/savings');
const { findUserById, getIncomeOfUser, getSavingOfUser } = require('../modules/userRequest');

exports.getSavingAmount = [
    async (req, res) => {


        const idUser = req.user.id;

        if (!idUser) {
            return res.status(400).json({ result: false, message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/balance" })
        }

        const saving = await getSavingOfUser(idUser)
        console.log('in serv ', saving)
        if (!saving && saving !== 0) {
            return res.status(400).json({ result: false, message: "Erreur lors de la récuperation de tout les revenus" })

        }
        // const allIncomes = await User.find({ user: idUser });

        // if (!allIncomes) {

        // }

        res.status(200).json({ result: true, saving })

    }
]

exports.addSaving = [
    async (req, res) => {

        const idUser = req.user.id;
        const today = new Date()

        if (!idUser) {
            return res.status(400).json({ result: false, message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/saving" })
        }

        const { amount, category, description, savingDate, source, savingMethod, frequency, status } = req.body

        if (!amount) {
            return res.status(400).json({ result: false, message: "Veuillez rentrer un montant" })

        }

        if (!savingDate) {
            return res.status(400).json({ result: false, message: "Veuillez rentrer une date d'économie" })
        }

        // if (new Date(paymentDate).getTime() < today.getTime()) {
        //     return res.status(400).json({ result: false, message: "Veuillez ne pouvez pas entrer une date de paiement inférieur à la date d'aujourd'hui" })

        // };:

        const newSaving = new Saving({
            user: idUser,
            amount,
            category,
            description,
            savingDate: new Date(savingDate),
            source,
            savingMethod,
            frequency,
            status
        })

        const saving = await newSaving.save();

        console.log(saving);

        if (!saving) {
            res.status(400).json({ result: false, message: "Erreur lors de la création de l'economie" })
        }

        const sumSaving = await getSavingOfUser(idUser)

        res.status(200).json({ result: true, saving: sumSaving, message: "Ajout de l'economie réussie !" })

    }
]

