const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const mysql = require('mysql');
const fileUpload = require('express-fileupload');

const app = express();

// default option
app.use(fileUpload());

require('dotenv').config();

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

const db = mysql.createConnection({
    host: process.env["DATABASE_HOST"],
    user: process.env["DATABASE_USER"],
    password: process.env["DATABASE_PASSWORD"],
    database: process.env["DATABASE"]
});

app.use(cookieParser()); //setup cookies in browser
app.use(bodyParser.urlencoded({ extended: true}));

// parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: false}))
// Parse JSON bodies (as sent by API clients)
app.use(express.json());


app.set('view engine', 'hbs')



db.connect( (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("Connected to MySQL Database...")
    }
})

//define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(5000, () => {
    console.log("Server started on Port 5000")
});