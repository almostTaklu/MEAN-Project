var mongoose = require('mongoose');
var moment = require('moment-timezone');

var getNewDate = function(){
    return moment().tz("America/New_York").format("DD MMMM YYYY");
}

var commentSchema = new mongoose.Schema({
    commentText: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    authorEmail: {
        type: String,
        required: true
    },
    createdOn: { 
        type: String, 
        default: getNewDate  // Ensuring default is a callable function without invoking it here
    }
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
    comments: [commentSchema]  // Correctly naming and embedding comments
});

mongoose.model('Blog', blogSchema);
