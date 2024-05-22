// exemple :

const checkUser = require("../checkUser");
const { getBalanceOfUser } = require("../userRequest");
const getDataAmountOfUser = require("./getDataAmountOfUser");

// dataType : expenses
const get = async (req, res, dataType) => {
  const idUser = req.user.id;

  checkUser(idUser, res)

  const data = await getDataAmountOfUser(idUser, res, dataType);

  if (!data && data !== 0) {
    return res.status(400).json({
      result: false,
      message: `Erreur lors de la récuperation de ${dataType}`
    });
  }

  res.json({ result: true, data: data });
}

module.exports = get;
