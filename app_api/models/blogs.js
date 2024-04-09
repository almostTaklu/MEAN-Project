var mongoose = require('mongoose');
var moment = require('moment-timezone');

var getNewDate = function(){
    return moment().tz("America/New_York").format("DD MMMM YYYY");
};

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
    }
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
    replies: [replySchema]  // Nested replies
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
