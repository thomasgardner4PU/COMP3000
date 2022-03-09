const express = require("express");
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
// const db = require('./database');
const app = express();
const port = require("dotenv");
const mysql = require('mysql');

const constants = require("constants");
const cookieParser = require("cookie-parser");

require('dotenv').config();


// enable CORS
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// serving static files
app.use('/uploads', express.static('uploads'));

// request handlers
app.get('/', (req, res) => {
    res.send('Node js file upload rest apis');
});
// handle storage using multer
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

let upload = multer({ storage: storage });

// handle single file upload
app.post('/upload-avatar', upload.single('dataFile'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send({ message: 'Please upload a file.' });
    }
    let sql = "INSERT INTO `file`(`name`) VALUES ('" + req.file.filename + "')";
    let query = db.query(sql, function(err, result) {
        return res.send({ message: 'File is successfully.', file });
    });
});





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
});