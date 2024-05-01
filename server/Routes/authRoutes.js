const express = require("express");
const router = express.Router();
const { loginControler, registerControler, getUser, logout } = require("../Controler/authControler");
const { jwtAuth } = require('../middleware/jwtauth');

router.post('/register', registerControler);
router.post('/login', loginControler);
router.get('/user', jwtAuth, getUser);
router.get('/logout', jwtAuth, logout);
module.exports = router;