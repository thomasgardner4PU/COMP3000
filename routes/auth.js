let express = require('express');
let authController = require('../controllers/auth')

let router = express.Router();

router.post('/register', authController.register)

module.exports = router;