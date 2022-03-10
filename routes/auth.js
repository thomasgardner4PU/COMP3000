let express = require('express');
let authController = require('../controllers/auth')
const {auth} = require("mysql/lib/protocol/Auth");


let router = express.Router();

router.post('/register', authController.register)

router.post('/login', authController.login)

router.get('/logout', authController.logout);

// router.post('/meditations', authController.loadMeditationPage);

module.exports = router;