const { validationResult } = require('express-validator')

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [ 
            {
                _id: "1",
                title: "Smokies", 
                content: "Here is the message",
                imageUrl: "images/roomHouse.jpg",
                creator: {
                    name: "Douglas",
                },
                createdAt: new Date()    
            }
        ]
    })
}
// 
// feed/post
exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;

    // craete post in db
    const post = new Post({
        title: title, 
        content: content,
        imageUrl: '/images/roomHouse.jpg',
        creator: {name : "douglas"},
    })
    post.save().then(result => {
        res.status(201).json({
            message: "Post created successfully",
            post: result
        })
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
            next(err)
        }
    })
}

