// async function to add expensesCategory

const ExpensesCategory = require("../models/expensesCategories");

exports.addExpensesCategory = [
    async (req, res) => {
        const idUser = req.user.id;
        const { category } = req.body;

        if (!idUser) {
            return res.status(400).json({
                result: false,
                message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/expenses"
            });
        }

        // Si la catégorie existe déjà on ne la sauvegarde pas
        const categoryExist = await ExpensesCategory.findOne({ user: idUser, category });

        if (categoryExist) {

            return res.status(400).json({
                result: false,
                message: "La catégorie existe déjà"
            });
        }



        const newExpensesCategory = new ExpensesCategory({
            user: idUser,
            category
        });

        await newExpensesCategory.save();

        res.json({ result: true, newExpensesCategory, message: "Catégorie ajoutée avec succès" });
    }
];

// get all expenses categories of user
exports.getExpensesCategories = [
    async (req, res) => {
        const idUser = req.user.id;

        if (!idUser) {
            return res.status(400).json({
                result: false,
                message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/expenses"
            });
        }

        const expensesCategories = await ExpensesCategory.find({ user: idUser });

        const formatedExpensesCategories = expensesCategories.map((category) => {
            return { name: category.category, id: category._id }
        });
        res.json({ result: true, expensesCategories: formatedExpensesCategories });
    }
];

// addBudgetOfExpensesCategory

exports.addBudgetOfExpensesCategory = [
    async (req, res) => {
        const idUser = req.user.id;
        const { category, budget } = req.body;
        
        if (!idUser) {
            return res.status(400).json({
                result: false,
                message: "Erreur lors de la récuperation de l'utilisateur lors de /users/idUser/expenses"
            });
        }

        const oneCategory = await ExpensesCategory.findOne({ user: idUser, _id: category });

        if (!oneCategory) {
            return res.status(400).json({
                result: false,
                message: "La catégorie n'existe pas"
            });
        }

        oneCategory.budget = budget;

        await oneCategory.save();

        res.json({ result: true, category: oneCategory, message: "Budget ajouté avec succès" });
    }
];
