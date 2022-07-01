const { validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const User = require('../models/user');


exports.signup = async (req, res, next) => {
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
    try {
        const hashedPw = await bcrypt.hash(password, 12) 
        const user = new User({
            email: email,
            password: hashedPw,
            name: name
        })
        const result = await user.save()
        res.status(201).json({message: 'user created', userId: result._id})
    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
            next(error)
        }
    }
}

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({email : email})
        if (!user) {
            const error = new Error('User not found!');
            error.statusCode = 401;
            throw error
        }
        const isEqual = await bcrypt.compare(password, user.password)
        if (!isEqual) {
            const error = new Error('wrong password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            email: user.email,
            userId: user._id.toString()
        },
            'SecretStringofyourChoice',
            { expiresIn: '1h'}
        );
        res.status(200).json({token: token, userId: user._id.toString()})
    } catch (error) {
        if(!err.statusCode) {
            err.statusCode = 500;
            next(err)
        }
    }
}