let express = require('express');
const {route} = require("express/lib/router");
const authController = require('../controllers/auth')

let router = express.Router();

router.get('/' , authController.isLoggedIn, (req, res) =>{
    res.render('index', {
        user: req.user
    });

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
        res.render('profile', {
            user: req.user
        });
    } else {
        res.redirect('/login');
    }
    // console.log(req.message);

});

module.exports = router;