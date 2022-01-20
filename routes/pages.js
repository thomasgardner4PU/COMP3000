let express = require('express');
const {route} = require("express/lib/router");

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

router.get('/profile', (req, res) => {
    res.render('profile');
})

module.exports = router;