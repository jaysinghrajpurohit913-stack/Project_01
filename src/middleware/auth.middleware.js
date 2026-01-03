require('dotenv').config();
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.cookies.token ;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_secret);
        req.user = decoded;
        return next();
    }
    catch (err) {
        return res.status(401).json({err, error: 'Invalid Token' });
    }
}

module.exports = auth;