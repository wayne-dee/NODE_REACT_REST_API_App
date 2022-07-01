const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator')

const Post = require('../models/post');
const User = require('../models/user')

// exports.getPosts = (req, res, next) => {
//     const currentPage = req.query.page || 1
//     const perPage = 2;
//     let totalItems;
//     Post.find().countDocuments()
//     .then(count => {
//         totalItems = count;
//         return Post.find()
//             .skip((currentPage -1) * perPage)
//             .limit(perPage)
//     })
//     .then(posts => {
//         res.status(200).json({
//             message: 'posts fetched successfully',
//             posts: posts,
//             totalItems: totalItems
//         })
    
//     }).catch(err => {
//         if(!err.statusCode) {
//             err.statusCode = 500;
//             next(err)
//         }
//     })
// }
// 

// ASYNC AWAIT
exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1
    const perPage = 2;
    let totalItems;
    try {
        totalItems = await Post.find().countDocuments()
        const posts = await Post.find()
            .skip((currentPage -1) * perPage)
            .limit(perPage)

        res.status(200).json({
            message: 'posts fetched successfully',
            posts: posts,
            totalItems: totalItems
        })
    
    } catch (error) {
        if(!err.statusCode) {
            err.statusCode = 500;
            next(err)
        }
    }
    
}


// feed/post
exports.createPost = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const imageUrl = req.file.path;
    const content = req.body.content;
    let creator;

    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId
    });
    try {
        await post.save()
        const user = await User.findById(req.userId);
        user.posts.push(post);
        await user.save();
        res.status(201).json({
            message: 'Post created successfully!',
            post: post,
            creator: { _id: user._id, name: user.name }
        });
    } catch (error) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getPost = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId)
        if(!post) {
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error
        }
        res.status(200).json({
            message: 'post fetched successfully',
            post: post
        })
    } catch (error) {
        if(!err.statusCode) {
            err.statusCode = 500;
            next(err)
        }
    }
}

exports.updatePost = async (req, res, next) => {
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
    try {
        const post = await Post.findById(postId)
        if(!post) {
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error
        }
        // Authorization
        if (post.creator.toString() !== req.userId) {
            const error = new Error('Not authorized');
            error.statusCode = 403;
            throw error
        }
        if(imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl)
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        const result = await post.save()
        res.status(200).json({message: 'Post updated', post: result})
    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
            next(error)
        }
    }
}

exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId)
            if(!post) {
                const error = new Error('Post not found');
                error.statusCode = 404;
                throw error
            }
            // Authorization
            if (post.creator.toString() !== req.userId) {
                const error = new Error('Not authorized');
                error.statusCode = 403;
                throw error
            }
            // clear image
            clearImage(post.imageUrl)
            await Post.findByIdAndRemove(postId)
            const user = await User.findById(req.userId)
            user.posts.pull(postId);
            await user.save()
            res.status(200).json({ message: 'Deleted post!' })
    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
            next(error)
        }
    }
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err))
}
