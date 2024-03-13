// authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1]
    console.log(req.headers['authorization'],"token")
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log(err)
            return res.sendStatus(403);}
        req.user = user;
        next();
    });
};  

module.exports = { authenticateToken };
