var request = require("request");
var apiOptions = {
	server : "http://localhost"
};

module.exports.index = function(req, res, responseBody){
	res.render('index', {title: 'Ganga Acharya Blogsite'});
};