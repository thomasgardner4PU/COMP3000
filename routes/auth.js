let express = require('express');
let authController = require('../controllers/auth')
const {route} = require("express/lib/router");

let router = express.Router();

router.post('/register', authController.register)

router.post('/login', authController.login)

module.exports = router;