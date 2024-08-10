const express = require('express');
const { check, body } = require('express-validator')
const User = require('../models/user')
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .normalizeEmail(),
    body('password', 'password has to be valid')
        .isLength({ min: 4 })
        .isAlphanumeric(),


], authController.postLogin);

router.get('/signup', authController.getSignup);
router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .normalizeEmail()
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('E-mail already exists, please try another one');
                        }
                    })
            }),
        body('password', 'Please enter a password with only numbers and text and at least 5 characters')
            .isLength({ min: 4 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords have to match!');
                }
                return true;
            })


    ],
    authController.postSignup);

router.post('/logout', authController.postLogout);

module.exports = router;