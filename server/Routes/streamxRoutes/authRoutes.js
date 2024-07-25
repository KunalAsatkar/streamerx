const express = require("express");
const router = express.Router();
const { loginControler, registerControler, getUser, logout } = require("../../Controler/streamx/authControler");
const { jwtAuth } = require('../../middleware/index');
const OAuthGoogleRouter = require('../OAuthRoutes/googleRoutes');
const OAuthInstaRouter = require('../OAuthRoutes/instaAuthRoutes');

router.post('/register', registerControler);
router.post('/login', loginControler);
router.get('/user', jwtAuth, getUser);
router.get('/logout', jwtAuth, logout);

// oauth routes
// google
router.use('/google', OAuthGoogleRouter);

// facebook/instagram
router.use('/instagram', OAuthInstaRouter);

module.exports = router;