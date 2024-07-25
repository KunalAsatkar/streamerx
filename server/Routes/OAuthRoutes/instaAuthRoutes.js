const { instaAccessTokenController } = require('../../Controler/instagram/instaAccessTokenController.js');
const express = require('express');
const router = express.Router();
const passport = require('../../utils/instaPassport.js');


// insta routes
router.get('/', passport.authenticate('instagram'));
router.get('/callback', passport.authenticate('instagram',
    {
        failureRedirect: 'http://localhost:5173/platform',
        successRedirect: 'http://localhost:5173/platform'

    }
))
router.get('/accesstoken', instaAccessTokenController);

module.exports = router;