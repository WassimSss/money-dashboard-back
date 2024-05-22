const checkUser = (idUser, res) => {
  if (!idUser) {
    return res.status(400).json({
      result: false,
      message: "Erreur lors de la récupération de l'utilisateur"
    });
  }
}

module.exports = checkUser;
