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

const db = mysql.createConnection({
    host: process.env["DATABASE_HOST"],
    user: process.env["DATABASE_USER"],
    password: process.env["DATABASE_PASSWORD"],
    database: process.env["DATABASE"]
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

        db.query('SELECT * FROM user WHERE email = ?', [email], async (error, results) => {

            if ( !results || !(await bcrypt.compare(password, results[0].password) ) ) {
                res.status(401).render('login', {
                    message: 'Email or password is incorrect'
                });
            } else {
                const id = results[0].id;

                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is: " + token);

                // req.session.user = results;
                // console.log(req.session.user)

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
    console.log(req.body);

    // let name = req.body.name;
    // let email = req.body.email;
    // let password = req.body.password;
    // let passwordConfirm = req.body.passwordConfirm;

    let { name, email, password, passwordConfirm } = req.body;
    db.query('SELECT email FROM user WHERE email = ?', [email], async (error, results) => {
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

        db.query('INSERT INTO user SET ? ', {name: name, email: email, password: hashedPassword }, (error, results) => {
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
    //
    console.log(req.cookies);
    if ( req.cookies.jwt ) {
        try {

            // step 1 verify the token , make sure the token exists and which user has what token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt,
                process.env.JWT_SECRET
            );

            // 2) check if the user still exists
            db.query('SELECT * FROM user WHERE id = ?', [decoded.id], (error, result) => {
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
        next();
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

exports.addProfilePicture = (req, res, next) => {
    let sampleFile;
    let uploadPath;

    //check request to see whether we are getting the file or not
    if (!req.files || Object.keys(req.files).length === 0){
        return res.status(400).send('no files were uploaded.');
    }

    // name of the input is sampleFile
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/public' + sampleFile.name;
    console.log(sampleFile)


    // use mv() to place file on the server
    sampleFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);

        res.send('File Uploaded!')
    });



}


/* ======================================================
       Section 3 - ToDo Management View functionality
=========================================================
 */
