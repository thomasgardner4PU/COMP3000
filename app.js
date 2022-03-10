const express = require("express");
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const multer = require('multer');
const port = require("dotenv");
const mysql = require('mysql');

const app = express();

require('dotenv').config();



const db = mysql.createConnection({
    host: process.env["DATABASE_HOST"],
    user: process.env["DATABASE_USER"],
    password: process.env["DATABASE_PASSWORD"],
    database: process.env["DATABASE"]
})

// enable CORS
// app.use(cors({
//     origin: ["http://localhost5001"],
//     methods: ["GET", "POST"],
//     credentials: true
// }));
app.use(cookieParser()); //setup cookies in browser
app.use(bodyParser.urlencoded({ extended: true}));

// app.use(
//     session({
//         key: "userId",
//         secret: "something",
//         resave: false,
//         saveUninitialized: false,
//         cookie: {
//             expires: 60 * 60 * 24,
//     },
// }));

// parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: false}))
// Parse JSON bodies (as sent by API clients)
app.use(express.json());


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
});