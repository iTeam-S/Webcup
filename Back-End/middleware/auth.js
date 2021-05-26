const jwt = require('jsonwebtoken');
const SECRET = 'mykey';

function verify_token(req, res, next){
    const token = req.headers.authorization ? req.headers.authorization.replace("Accessing ", "") : false;
    // Présence d'un token
    if (!token) {
        res.status(401).json({ message: 'Error: Need a token' });
    }

    // Véracité du token
    jwt.verify(token, SECRET, (err, decodedToken) => {
        if (err) res.status(401).json({ message: 'Error: Bad token' })
        next()
    })
}

module.exports = {
    verified: (req, res, next) => {
        verify_token(req, res, next);
    },
}