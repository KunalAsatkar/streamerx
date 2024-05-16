const express = require("express");
const router = express.Router();
const { notifyController } = require("../Controler/notifyController");

router.post('/', notifyController);

module.exports = router;