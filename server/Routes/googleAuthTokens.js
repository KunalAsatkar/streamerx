const express = require('express')
const router = express.Router();
const { getAccessTokenController } = require('../Controler/getAccessTokenController.js');

router.get('/', getAccessTokenController);

module.exports = router;