const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const {hashPassword} = require("mysql/lib/protocol/Auth");
const mysql = require("mysql")
const {decode} = require("jsonwebtoken");


const db = mysql.createConnection({
    host: process.env["DATABASE_HOST"],
    user: process.env["DATABASE_USER"],
    password: process.env["DATABASE_PASSWORD"],
    database: process.env["DATABASE"]
})

exports.getAudio = async (req,res) => {
    // query database to get audio file row
        // SELECT * FROM filesTbl WHERE id = req.body.id AND type = 1

}


exports.getprofilePicture = async (req,res) => {
    // query database to get image row
        // SELECT value FROM settingstbl WHERE Userid = Userid AND key = profilePicture
}


// user will either select background colour or background file
exports.saveSetting = async (req, res) => {
    let backgroundRAWValue = "colour-blue";
    let backgroundKeyvalue = backgroundRAWValue.split("-")
    let backgroundType = backgroundKeyvalue[0]
    let backgroundValue = backgroundKeyvalue[1]
    if (backgroundType == "colour"){

    }else if (backgroundType == "file") {

    } else {
        //return default colour or file
    }


    if (req.body.file) {
        backgroundRAWValue = `file-${req.body.file}`
    } else if (req.body.colour) {
        backgroundRAWValue = `colour-${req.body.colour}`
    }
}

exports.loadSetting = async (req,res) => {

}


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

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/");
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

// exports.register = (req, res) => {
//     console.log(req.body);
//     const { name, email, password, passwordConfirm } = req.body;
//
//     // 2) Check if user exists && password is correct
//     db.start.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
//         if(error) {
//             console.log(error)
//         }
//
//         if(results.length > 0 ) {
//             return res.render('register', {
//                 message: 'That Email has been taken'
//             });
//         } else if(password !== passwordConfirm) {
//             return res.render('register', {
//                 message: 'Passwords do not match'
//             });
//         }
//
//         let hashedPassword = await bcrypt.hash(password, 8);
//         console.log(hashedPassword);
//
//         db.start.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (error, result) => {
//             if(error) {
//                 console.log(error)
//             } else {
//                 db.start.query('SELECT id FROM users WHERE email = ?', [email], (error, result) => {
//                     const id = result[0].id;
//                     console.log(id);
//                     const token = jwt.sign({ id }, process.env.JWT_SECRET, {
//                         expiresIn: process.env.JWT_EXPIRES_IN
//                     });
//
//                     const cookieOptions = {
//                         expires: new Date(
//                             Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
//                         ),
//                         httpOnly: true
//                     };
//                     res.cookie('jwt', token, cookieOptions);
//
//                     res.status(201).redirect("/");
//                 });
//             }
//         });
//     });
// };

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