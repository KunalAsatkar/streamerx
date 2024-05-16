const passport = require("passport");
const dotenv = require('dotenv');
const User = require('../Models/userModel.js');

dotenv.config();

var GoogleStrategy = require('passport-google-oauth20').Strategy;

const scope = [
  'email',
  'profile',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.force-ssl'
];

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLI_ID,
    clientSecret: process.env.GOOGLE_CLI_SEC,
    callbackURL: "http://localhost:8000/auth/google/callback",
    accessType: 'offline',
    scope: scope,
  },
  async function(accessToken, refreshToken, profile, cb) {
    console.log('profile: ', profile, 'AccessTkn: ', accessToken, "RefreshTkn: ", refreshToken);
    // console.log(process.env.GOOGLE_CLI_ID)
    // console.log('access: ' +  accessToken, 'refresh: ' + refreshToken);

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