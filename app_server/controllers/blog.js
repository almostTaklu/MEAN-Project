var express = require('express');
var request = require('request');
const { render } = require('../../app');
const Blog = require('../../app_api/models/blogs');

var apiOptions = {
    server : "http://localhost"
};
 

// Get the blog list
module.exports.blogList = function (req, res) {
    var requestOptions, path;
    path = '/api/blogs';
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(
        requestOptions,
        function (err, response, body) {
            if (err) {
                // Handle error
                console.error(err);
                res.status(500).send("Error fetching blogs");
            }
            res.render('blog-list', {
                title: 'Blog List',
                blogs: body,
            });
        }
    );
};

// Get add blog page
module.exports.blogAdd = function (req, res) {
    res.render('blog-add', { title: 'Add Blog' });
};

// Do Add a blog
module.exports.doAddBlog = function (req, res) {
    var requestOptions, path, postdata;
    path = '/api/blogs';
    postdata = {
        blogTitle: req.body.blogTitle,
        blogText: req.body.blogText
    };
    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postdata
    };
    request(
        requestOptions,
        function (err, response, body) {
            if (response.statusCode === 201) {
                res.redirect('/blogList');
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};

// Render the edit blog page
var renderEditBlog = function (req, res, blogData) {
    res.render('blog-edit', {
        title: 'Edit Blog',
        blog: blogData
    });
};

// Get the edit blog
module.exports.editBlog = function (req, res) {
    var requestOptions, path;
    path = '/api/blogs/' + req.params.blogid;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(
        requestOptions,
        function (err, response, body) {
            renderEditBlog(req, res, body);
        }
    );
};

// Do Edit a blog
module.exports.doEditBlog = function (req, res) {
    var id = req.params.blogid;
    var requestOptions, path, postdata;
    path = '/api/blogs/' + id;
    postdata = {
        blogTitle: req.body.blogTitle,
        blogText: req.body.blogText
    };
    requestOptions = {
        url: apiOptions.server + path,
        method: "PUT",
        json: postdata
    };
    request(
        requestOptions,
        function (err, response, body) {
            if (response.statusCode === 200) {
                console.log(body);
                res.redirect('/blogList');
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};

//render delete blog page
var renderDeleteBlog = function (req, res, responseBody) {
    res.render('blog-delete', { 
            title: 'Blog Delete', 
            blog: responseBody 
        });
};

// Get the delete blog
module.exports.deleteBlog = function (req, res) {
    path = "/api/blogs/" + req.params.blogid;
	requestOptions = {
		url : apiOptions.server + path,
		method : "GET",
		json : {}
	};
	request(requestOptions, function(err, response, body) {
		renderDeleteBlog(req, res, body);
	});
};

// Do Delete a blog
module.exports.doDeleteBlog = function (req, res) {
    var requestOptions, path, postdata;
    var id = req.params.blogid;
    path = '/api/blogs/' + id;
    requestOptions = {
        url: apiOptions.server + path,
        method: "DELETE",
        json: {}
    };
    request(
        requestOptions,
        function (err, response, body) {
            if (response.statusCode === 204) {
                res.redirect('/blogList');
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};

var _showError = function (req, res, status) {
    var title, content;
    if (status === 404) {
    title = "404, page not found";
    content = "Oh dear. Looks like we can't find this page. Sorry.";
} else if (status === 500) {
    title = "500, internal server error";
    content = "How embarrassing. There's a problem with our server.";
} else {
    title = status + ", something's gone wrong";
    content = "Something, somewhere, has gone just a little bit wrong.";
}
    res.status(status);
    res.render('generic-text', {
    title : title,
    content : content
});
};