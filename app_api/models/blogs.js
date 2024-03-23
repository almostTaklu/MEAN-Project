var mongoose = require('mongoose');
var moment = require('moment-timezone');

var getNewDate = function(){
    return moment().tz("America/New_York").format("MM/DD/YYYY, hh:mm a");
}

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
        "default": getNewDate 
    },

    author: {
        type: String,
        required: true
    },

    authorEmail: {
        type: String,
        required: true
    }
});

mongoose.model('Blog', blogSchema);
