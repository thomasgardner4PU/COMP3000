const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const {hashPassword} = require("mysql/lib/protocol/Auth");
const mysql = require("mysql")
const {decode} = require("jsonwebtoken");
const cors = require("cors");
const {token} = require("mysql");
const {expires} = require("express-session/session/cookie");
const fileUpload = require("express-fileupload");


// for user profile image
const defaultImage = "Avatar.png";

const db = mysql.createConnection({
    host: process.env["DATABASE_HOST"],
    user: process.env["DATABASE_USER"],
    password: process.env["DATABASE_PASSWORD"],
    database: process.env["DATABASE"],
    filepath: process.env["DATABASE_IMAGES"]
});

// Connection Pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'comp3000'
});

pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected!');
});


/* ======================================================
       Section 1 - Login/register & user profile functionality
=========================================================
 */

exports.login = async (req, res) => {
    try {
        const {email, password } = req.body;

        if ( !email || !password) {
            return res.status(401).render('login', {
                message: 'Please provide an email and password'
            })
        }

        db.query('SELECT * FROM usertbl WHERE email = ?', [email], async (error, results) => {

            console.log(results)

            if (results.length == 0){
                console.log("l")
            }

            // when logging in with incorrect details, app crashes..
            console.log("printing results" + results);
            if ( results.length == 0 || !(await bcrypt.compare(password, results[0].password) ) ) {
                res.status(401).render('login', {
                    message: 'Email or password is incorrect'
                });
            } else {
                const id = results[0].user_id;
                // console.log(id)

                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is: " + token);


                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/profile");
            }


        })
    } catch (error) {
        console.log(error)
    }
}



exports.register = (req, res) => {
    // console.log(req.body);

    let { name, email, password, passwordConfirm } = req.body;
    db.query('SELECT email FROM usertbl WHERE email = ?', [email], async (error, results) => {
        if(error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            });
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'That passwords do not match'
            });
        }

       let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO usertbl SET ? ', {name: name, email: email, password: hashedPassword }, (error, results) => {
            if(error){
                console.log(error);
            } else {
                console.log(results);
                return res.render('register', {
                    message: 'User registered'
                });
            }
        })
    });
}

exports.isLoggedIn = async (req, res, next) => {
    // // creating a variable inside of a request called message as shown below, and
    // // req.message = "inside middleware";
    // // next is to ensure that we can render the page, or else the function won't run properly
    console.log(req.cookies);
    if ( req.cookies.jwt && req.cookies.jwt !== "logout"){
        try {

            // step 1 verify the token , make sure the token exists and which user has what token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt,
                process.env.JWT_SECRET
            );

            // 2) check if the user still exists
            db.query('SELECT * FROM usertbl WHERE user_id = ?', [decoded.id], (error, result) => {
                console.log(result);

                if (!result) {
                    return next();
                }

                req.user = result[0];
                return next();

            });
            console.log(decoded)
        } catch (error) {
            console.log(error)
            return next();
        }
    } else {
        res.redirect("/login")
        // next();
    }


};

exports.logout = async (req, res, next) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2*1000 ),
        httpOnly: true
    });

    res.status(200).redirect('/');
}

/* ======================================================
       Section 2 - Profile picture functionality
=========================================================
 */

exports.getProfilePicture = (req, res, next) => {

    // console.log(req);
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log('Connected!');

        connection.query('SELECT * FROM userprofileimagetbl WHERE user_id = ?',[req.user.user_id],(err, rows) => {
          // Once done, release connection
          connection.release();
          if (!err) {
            // res.render('profile', { rows });
              if (rows.length == 1){
                  req.PFP = rows[0].profile_image
              } else {
                  req.PFP = defaultImage;
              }
              next();
          }
        });

      });
}

exports.addProfilePicture = (req, res) => {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // name of the input is sampleFile
    sampleFile = req.files.sampleFile;
    uploadPath = process.env.database_images + '/' + sampleFile.name;

    console.log(sampleFile);

    // Use mv() to place file on the server
    sampleFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);

        db.query('INSERT INTO userprofileimagetbl (user_id, profile_image) VALUES (?, ?) ON DUPLICATE KEY UPDATE profile_image = ?', [req.user.user_id, sampleFile.name, sampleFile.name],(err, rows) => {
            if (!err) {
                res.redirect('/profile');
            } else {
                console.log(err);
            }
        });
    });
}


/*
======================================================
       Section 3 - ToDo Management View functionality
=========================================================
 */

exports.get_Todo = (req, res) => {
    const queryString = "SELECT * FROM todos WHERE user_id = ? AND complete = '0'"
    db.query(queryString, [req.user.user_id], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query @ /get_todo: " + err)
            }
        console.log("Getting data from database @ /get_todos")
        res.json(rows)
    })
}

exports.add_Todo = (req, res) => {
    const todo = req.body.add_todo_input
    const  queryString = "INSERT INTO todos (user_id, todo) VALUES (?, ?)"
    db.query(queryString, [req.user.user_id, todo], (err, rows, fields) => {
        if (err) {
            console.log("Failed to insert @ /get_todo: " + todo + "" + err)
        }
        console.log("@/add_todo : " + todo + " added.")
        res.redirect('/notes')
    })
}

exports.complete_Todo = (req, res) => {
    const todo_id = req.params.id
    const queryString = "UPDATE todos SET complete = '1' WHERE todo_id = ?"
    db.query(queryString, [todo_id], (err, rows, fields) => {
        if (err) {
            console.log("Failed to complete todo @ /complete_todo: " + todo_id + " " + err)
        }
        console.log("@/complete_todo/ completing todo with id" + todo_id)
        res.redirect('/notes')
    })
}