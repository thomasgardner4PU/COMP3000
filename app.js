const express = require("express")
const mysql = require("mysql")
const dotenv = require("dotenv")

// dotenv.config({ path: './.env' });

// dotenv.config({ path:__dirname + '/.env' })

const path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname, '/.env')
})

const app = express();

const db = mysql.createConnection({
    host: process.env["DATABASE_HOST"],
    user: process.env["DATABASE_USER"],
    password: process.env["DATABASE_PASSWORD"],
    database: process.env["DATABASE"]
})

app.get("/", (req, res) => {
    res.send("<h1>Home Page</h1>")
})

app.listen(5000, () => {
    console.log("Server started on Port 5001")
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