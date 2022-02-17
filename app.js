const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require('path');
const constants = require("constants");
const cookieParser = require("cookie-parser");

require('dotenv').config();

const app = express();

const db = mysql.createConnection({
    host: process.env["DATABASE_HOST"],
    user: process.env["DATABASE_USER"],
    password: process.env["DATABASE_PASSWORD"],
    database: process.env["DATABASE"]
})

// parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: false}))
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cookieParser()); //setup cookies in browser

app.set('view engine', 'hbs')

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

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

app.listen(5001, () => {
    console.log("Server started on Port 5001")
})