const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
        // Récupération du Token qui ce trouve dans le header de la requête
        const token = req.headers.authorization.split(' ')[1];
        // Décodage du token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // Récupération de l'id de l'utilisateur authentifié par rapport au token décodé
        const userId = decodedToken.userId;
        req.auth = {
           userId: userId
        };
	next();
   } catch(error) {
        res.status(401).json({ error });
   }
};