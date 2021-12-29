const express = require("express")

const app = express();

app.get("/", (req, res) => {
    res.send("<h1>Home Page</h1>")
})

app.listen(5000, () => {
    console.log("Server started on Port 5000")
})


let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'proj-mysql.uopnet.plymouth.ac.uk',
    user: 'COMP3000_TGardner',
    password: 'TMOZwaZUaawEZeN2',
    database: 'COMP3000_TGardner'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields){
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});

connection.end();

// connection.connect(function (err) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }
//
//     console.log('connected as id ' + connection.threadId);
// });