var mongoose = require('mongoose');

var getNewDate = function() {
    return new Date().toLocaleString("en-US", { 
        timeZone: "America/New_York",
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true});
}

var blogSchema = new mongoose.Schema({
    blogTitle: String,
    blogText: String,
    createdOn: { 
        type: String, 
        "default": getNewDate 
    }
});

mongoose.model('Blog', blogSchema);
