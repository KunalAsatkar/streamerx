const session = require('express-session');
const { sessionSecret } = require('../config/dotenvConfig');

// y ? generated unique id(session-id) when loggin using google auth
module.exports = session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
});