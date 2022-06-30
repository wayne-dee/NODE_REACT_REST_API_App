const mongoose = require('mongoose');

const Schema = mongoose.Schema;

postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, 
    { timestamps: true } // createdAt
);

module.exports = mongoose.model('Post', postSchema);

