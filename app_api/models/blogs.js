var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    blogTitle: String,
    blogText: String,
    createdOn: { type: Date, default: Date.now }
});

mongoose.model('Blog', blogSchema);console.log("Blog model:", mongoose.model('Blog', blogSchema)); 
module.exports = mongoose.model('Blog', blogSchema);
