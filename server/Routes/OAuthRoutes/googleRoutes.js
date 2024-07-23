const express = require('express');
const router = express.Router();
const { disconnectYt } = require('../../Controler/google/disconnectYt.js')
const { getAccessTokenController } = require('../../Controler/google/getAccessTokenController.js');
const { passport } = require('../../middleware/index.js');

const scope = [
    'email',
    'profile',
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl'
];

router.get('/', passport.authenticate('google', { scope: scope, accessType: 'offline' }))
router.get('/callback', passport.authenticate('google', {
    successRedirect: 'http://localhost:5173/platform',
    failureRedirect: 'http://localhost:5173/platform'
}
));
router.get('/accesstoken', getAccessTokenController);
router.post('/disconnect', disconnectYt);

module.exports = router;