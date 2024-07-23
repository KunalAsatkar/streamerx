const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    port: process.env.PORT || 8000,
    sessionSecret: process.env.EXPRESS_SESSION_SECRET,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};