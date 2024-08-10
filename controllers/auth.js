const bcrypt = require('bcryptjs');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
}));

const getLogin = (req, res, next) => {
    //console.log(req.session);
    let message = req.flash('error');
    message = message.length > 0 ? message[0] : message = null;
    res.render("auth/login", {
        pageTitle: "Login",
        path: "/login",
        errorMessage: message,
        oldInput: {},
        validationErrors: []
    });
}

const postLogin = (req, res, next) => {
    const email = req.body.email;
    console.log(email)
    const password = req.body.password

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("auth/login", {
            pageTitle: "login",
            path: "/login",
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
            },
            validationErrors: errors.array()
        })
    }

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(422).render("auth/login", {
                    pageTitle: "Login",
                    path: "/login",
                    errorMessage: 'invalid email or password',
                    oldInput: {
                        email: email,
                        password: password,
                    },
                    validationErrors: []
                });
            }
            bcrypt
                .compare(password, user.password)
                .then((isMatch) => {
                    if (isMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            if (err) console.log(err);
                            res.redirect('/');
                        });
                    }
                    return res.status(422).render("auth/login", {
                        pageTitle: "Login",
                        path: "/login",
                        errorMessage: 'invalid email or password',
                        oldInput: {
                            email: email,
                            password: password,
                        },
                        validationErrors: []
                    });
                })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        })

}

const getSignup = (req, res, next) => {
    let message = req.flash('error');
    message = message.length > 0 ? message[0] : message = null;
    res.render("auth/signup", {
        pageTitle: "Signup",
        path: "/signup",
        errorMessage: message,
        oldInput: {},
        validationErrors: []
    });
}

const postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render("auth/signup", {
            pageTitle: "Signup",
            path: "/signup",
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
                confirmPassword: confirmPassword
            },
            validationErrors: errors.array()
        })
    }

    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            })
            return user.save()
        })
        .then(result => {
            res.redirect('/login');
            return transporter.sendMail({
                to: email,
                from: 'shop@nodejs',
                subject: 'Signup succeeded',
                html: '<h1>You successfuly signed up!</h1>'
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        })
}

const postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) console.log(err);

        res.redirect('/login');
    })
}


module.exports = {
    getLogin,
    postLogin,
    postLogout,
    getSignup,
    postSignup,
}
