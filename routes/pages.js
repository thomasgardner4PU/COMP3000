let express = require('express');
const {route} = require("express/lib/router");
const authController = require('../controllers/auth')

let router = express.Router();

router.get('/', (req, res) =>{
    res.render('index');
});

router.get('/register', (req, res) =>{
    res.render('register');
});

router.get('/login', (req, res) =>{
    res.render('login');
});

// creating middleware
router.get('/profile', authController.isLoggedIn, (req, res) => {
    if ( req.user) {
        res.render('profile');
    } else {
        res.redirect('/login');
    }
    // console.log(req.message);

});

module.exports = router;