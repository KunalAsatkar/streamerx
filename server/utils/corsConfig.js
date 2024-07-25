const cors = require('cors');
const { corsOrigin } = require('../config/dotenvConfig');

module.exports = cors({
    origin: corsOrigin,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
});