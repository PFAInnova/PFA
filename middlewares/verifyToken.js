const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Récupérer le token de l'en-tête de la requête
    const token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
    }

    try {
        // Décoder le token
        const decoded = jwt.verify(token, 'ton_secret_key');
        req.userId = decoded.userId; // Ajouter l'ID utilisateur à la requête
        next();  // Passer au prochain middleware ou à la route
    } catch (err) {
        return res.status(400).json({ message: 'Token invalide' });
    }
};

module.exports = verifyToken;
