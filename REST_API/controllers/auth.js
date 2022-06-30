const { validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');


exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array()
        throw error
    }

    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.name;

    bcrypt.hash(password, 12).then(hashedPw => {   
        const user = new User({
            email: email,
            password: hashedPw,
            name: name
        })
        return user.save()
    }).then(result => {
        res.status(201).json({
            message: 'user created', userId: result._id
        })
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
            next(err)
        }
    })
}