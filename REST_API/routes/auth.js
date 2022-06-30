const { body } = require('express-validator')

const express = require('express');
const user = require('../models/user');
const authControllers = require('../controllers/auth')

const router = express.Router();

router.put('/signup',[
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, { req }) => {
            return user,findOne({email : value }).then(userDoc => {
                if(userDoc) {
                    return Promise.reject('E-mail already exists')
                }
            })
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({min: 5}),
    body('name')
        .trim()
        .not()
        .isEmpty()
], );

module.exports = router;