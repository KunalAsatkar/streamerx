const passport = require('passport');
require('../utils/passport.js');
require('../utils/instaPassport.js');

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;