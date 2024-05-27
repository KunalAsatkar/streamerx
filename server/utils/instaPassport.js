const passport = require('passport');
const InstagramStrategy = require('passport-instagram').Strategy;
const dotenv = require('dotenv')

dotenv.config();

const User = require('../Models/userModel');

const instaRedirectUri = 'http://localhost:8000/auth/instagram/callback';
const instaScope = 'public_profile,instagram_graph_user_profile,instagram_graph_user_media';

passport.use(new InstagramStrategy({
    clientID: process.env.INSTA_APP_ID,
    clientSecret: process.env.INSTA_APP_SEC,
    callbackURL: instaRedirectUri,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // const user = await User.findOne({email: email})

        // if(user) {
        //     user.instagramId = profile.id;
        //     user.instagramAccessToken = accessToken
        //     user.instagramRefreshToken = refreshToken
        //     await user.save();
        // }

        // return done(null, user);
        console.log('Access: ' + accessToken, 'RefreshTokne: ' + refreshToken, 'profile: ' + profile);
    } catch (error) {
        console.log('Error in insta OAuth: ', error);
        return done(error, null);
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        console.log('Error in deserializing user in insta oauth: ', error);
        done(error, null);
    }
});