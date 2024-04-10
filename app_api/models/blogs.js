var mongoose = require('mongoose');
var moment = require('moment-timezone');

var getNewDate = function(){
    return moment().tz("America/New_York").format("DD MMMM YYYY");
};

var userReactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'User ID is required',
        ref: 'User' // This is a reference to the User model
    },
    reaction: {
        type: String,
        required: 'Reaction is required',
        enum: ['like', 'dislike']
    }
}, {_id: false});

var replySchema = new mongoose.Schema({
    commentText: {
        type: String,
        required: 'Please enter your reply',
    },
    author: {
        type: String,
        required: 'Author is required',
    },
    authorEmail: {
        type: String,
        required: 'Author email is required',
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    userReactions: [userReactionSchema]
});

var commentSchema = new mongoose.Schema({
    commentText: {
        type: String,
        required: 'Comment text is required',
    },
    author: {
        type: String,
        required: 'Author is required',
    },
    authorEmail: {
        type: String,
        required: 'Author email is required',
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    userReactions: [userReactionSchema],
    replies: [replySchema] // Nested replies
});

var blogSchema = new mongoose.Schema({
    blogTitle: {
        type: String,
        required: true
    },
    blogText: {
        type: String,
        required: true
    },
    createdOn: { 
        type: String, 
        default: getNewDate
    },
    author: {
        type: String,
        required: true
    },
    authorEmail: {
        type: String,
        required: true
    },
    comments: [commentSchema]
});

mongoose.model('Blog', blogSchema);
