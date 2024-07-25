const JWT = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const jwtAuth = (req, res, next) => {
    // const token = (req.cookies && req.cookies.token) || null; when token is passed in cookies
    const token = req.headers.authorization;
    // console.log(`jwtauth: ${token}`);
    if (!token) {
        return res.status(400).json({
            success: false,
            data: "Not authorized"
        })
    }
    try {
        const payload = JWT.verify(token, process.env.SECRET);
        // console.log(payload.id, payload.email);
        req.user = { id: payload.id, email: payload.email }
    }
    catch (e) {
        console.log('error in jwt: ', e);
        return res.status(400).json({
            success: false,
            data: "error"
        })
    }

    next();
}

module.exports = jwtAuth;