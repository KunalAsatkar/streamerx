const passport = require("passport");
const dotenv = require('dotenv');
const User = require('./Models/userModel.js');

dotenv.config();

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLI_ID,
    clientSecret: process.env.GOOGLE_CLI_SEC,
    callbackURL: "/auth/google/callback",
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.readonly'],
  },
  async function(accessToken, refreshToken, profile, cb) {
    // console.log(profile, accessToken, refreshToken);
    console.log('access: ' +  accessToken, 'refresh: ' + refreshToken);

    //if user exists
    //if user dosent' exists
    try {
        const user = await User.findOne({ email: profile.emails[0].value });
        if(user) {
            user.googleId = profile.id;
            user.googleAccessToken = accessToken;
            user.googleRefreshToken = refreshToken;

            await user.save();
        }

        return cb(null, profile);
    } catch (error) {
        return cb(error, null);
    }
  }
));