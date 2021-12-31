let express = require('express');
const {route} = require("express/lib/router");
const {auth} = require("mysql/lib/protocol/Auth");
const authController = require('../constrollers/auth')

let router = express.Router();

router.post('/register', authController.register)

module.exports = router;