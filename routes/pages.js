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
router.get('/profile', authController.isLoggedIn, authController.getProfilePicture,  (req, res) => {
    if ( req.user) {
        console.log(req.user)
        res.render('profile', {
            user: req.user,
            profileImage: req.PFP
        });
    } else {
        res.redirect('/login');
    }
    console.log(req.message);

});

router.post('/profile', authController.isLoggedIn, authController.addProfilePicture, (req, res) => {
    res.render('profile');
});


router.get('/meditations', authController.isLoggedIn, ( req,res) => {
    if ( req.user) {
        res.render('meditations', {
            user: req.user
        });
    } else {
        res.redirect('/login');
    }
});

router.get('/notes', authController.isLoggedIn, (req, res) => {
    if ( req.user) {
        res.render('notes', {
            user: req.user
        });
    } else {
        res.redirect('/login');
    }
});

router.get('/get_todos', authController.isLoggedIn, authController.get_Todo, (req,res) => {
    res.render('get_todo');
});

router.post('/add_todo' , authController.isLoggedIn, authController.add_Todo, (req, res) => {
    res.render('add_todo');
});

router.post("/complete_todo/:id", authController.complete_Todo, (req, res) => {
    res.render('complete_todo/:id');
});

router.get('/otherMeditations', (req,res) => {
    res.render('otherMeditations')
});

router.get('/meditationSelection', (req,res) => {
    res.render('meditationSelection')
});


module.exports = router;