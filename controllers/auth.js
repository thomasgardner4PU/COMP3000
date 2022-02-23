const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const {hashPassword} = require("mysql/lib/protocol/Auth");
const mysql = require("mysql")


const db = mysql.createConnection({
    host: process.env["DATABASE_HOST"],
    user: process.env["DATABASE_USER"],
    password: process.env["DATABASE_PASSWORD"],
    database: process.env["DATABASE"]
})

exports.login = async (req, res) => {
    try {
        const {email, password } = req.body;

        if ( !email || !password) {
            return res.status(400).render('login', {
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
    // console.log(req.cookies);
    // // if ( req.cookies.jwt ) {
    // //     try {
    // //         const decoded =
    // //     } catch (error)
    // // }
    // next();
};