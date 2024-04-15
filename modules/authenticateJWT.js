const jwt = require('jsonwebtoken');


const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]; // Supposant que le token est envoyé sous la forme "Bearer <token>"
    // console.log(req.headers);
    // console.log('token : ', token);
    try {
        if (!token) {
            return res.status(401).json({ isAuthenticated: false, message: 'Aucun token fourni' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ isAuthenticated: false, message: 'Authentification requise' });
            }
            req.user = user;
            console.log('auth a partir du middleware reussie')
            next();
            // return res.status(201).json({ isAuthenticated: true });
        });
        // Si le token est valide, 'decoded' contiendra les informations décodées du token
    } catch (err) {
        // Si le token est invalide ou expiré, une exception sera levée
        console.error('Token invalide:', err);
    }
}

module.exports = { authenticateJWT };