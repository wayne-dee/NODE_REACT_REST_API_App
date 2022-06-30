const { body } = require('express-validator')

const express = require('express');
const user = require('../models/user');
const authControllers = require('../controllers/auth')

const router = express.Router();

router.put('/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.'),
            // .custom((value, { req }) => {
            //     return User.findOne({ email: value }).then(userDoc => {
            //       if (userDoc) {
            //         return Promise.reject('E-Mail address already exists!');
            //       }
            //     });
            //   })
            // .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 5 }),
        body('name')
        .trim()
        .not()
        .isEmpty()
    ], authControllers.signup);

module.exports = router;