const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator')

const Post = require('../models/post');
const { findByIdAndRemove } = require('../models/post');

exports.getPosts = (req, res, next) => {
    Post.find().then(posts => {
        res.status(200).json({
            message: 'posts fetched successfully',
            posts: posts
        })
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
            next(err)
        }
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
    const imageUrl = req.file.path;
    const content = req.body.content;

    // craete post in db
    const post = new Post({
        title: title, 
        content: content,
        imageUrl: imageUrl,
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

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId).then(post => {
        if(!post) {
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error
        }
        res.status(200).json({
            message: 'post fetched successfully',
            post: post
        })
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
            next(err)
        }
    })
}

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if(req.file) {
        imageUrl = req.file.path;
    }
    if(!imageUrl) {
        const error = new Error('File not picked');
        error.statusCode = 422;
        throw error
    }
    Post.findById(postId).then(post => {
        if(!post) {
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error
        }
        if(imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl)
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        return post.save()
    })
    .then(result => {
        res.status(200).json({
            message: 'Post updated',
            post: result
        })
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
            next(err)
        }
    })
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId).then(post => {
        if(!post) {
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error
        }
        // clear image
        clearImage(post.imageUrl)
        return Post.findByIdAndRemove(postId)
    }).then(result => {
        console.log(result);
        res.status(200).json({ message: 'Deleted post!' })
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
            next(err)
        }
    })
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err))
}
