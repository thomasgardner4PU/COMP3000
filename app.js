const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require('path');
const constants = require("constants");

require('dotenv').config();

const app = express();

const db = mysql.createConnection({
    host: process.env["DATABASE_HOST"],
    user: process.env["DATABASE_USER"],
    password: process.env["DATABASE_PASSWORD"],
    database: process.env["DATABASE"]
})

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.set('view engine', 'hbs')

app.listen(5001, () => {
    console.log("Server started on Port 5001")
})

app.get("/", (req, res) => {
    // res.send("<h1>Home Page</h1>");
    res.render("index");
})

app.get("/register", (req, res) => {
    res.render("register")
})

//
// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields){
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
// });
//
// connection.end();

// db.connect(function (err) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }
//
//     console.log('connected as id ' + db.threadId);
// });

db.connect( (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("Mysql Connected...")
    }
})