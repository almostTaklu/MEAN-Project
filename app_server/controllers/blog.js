var request = require('request');
var errorHandlers = require('../../public/javascript/error.js');
const { render } = require('../../app');
var apiOptions = {
    server : "http://localhost"
};


/* GET home page. */
module.exports.index = function(req, res) {
    var requestOptions, path;
    path = '/api/blogs';
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {},
    };
    request(requestOptions, 
        function(err, response, body) {
            if (err) {
                console.error(err);
                res.status(500).send("Error fetching blogs");
                return;
            }
            renderHomepage(req, res, body);
        }
    );
};

// Render the home page
var renderHomepage = function(req, res, responseBody) {
    res.render('index', { 
        title: 'Ganga Acharya Blog Site', 
        blogs: responseBody
    });
};

//GET blog list
module.exports.blogList = function (req, res) {
    var requestOptions, path;
    path = '/api/blogs';
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {},
    };
    request(requestOptions, 
        function (err, response, body) {
            if (err) {
                // Handle error
                console.error(err);
                res.status(500).send("Error fetching blogs");
                return;
            }
            // Use this function to render the blog list page with the fetched blogs
            renderListpage(req, res, body);
        }
    );
};

// Render blog list page
var renderListpage = function (req, res, responseBody) {
    // Assuming responseBody is an array of blogs
    res.render('blog-list', { 
        title: 'Blog List', 
        blogs: responseBody  // Pass blogs from the API response
    });
};

/* POST blog */
module.exports.blogAdd = function(req, res){
    res.render('blog-add', {title: 'Blog Add'});
}

module.exports.blogCreate = function(req, res) {
    var requestOptions, path, postdata;
    path = '/api/blogs';

    postdata = {
        blogTitle: req.body.blogTitle,
        blogText: req.body.blogText,
        //createdOn: req.body.createdOn
    };
    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postdata
    };
    request(
        requestOptions, 
        function(err, response, body) {
        if (response.statusCode === 201) {
            res.redirect('/blogList');
        } else {
            _showError(req, res, response.statusCode);
        }
    });
};

exports.blogEdit = function(req, res) {
    var requestOptions, path;
    path = `/api/blogs/${req.params.id}`;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(requestOptions, function(err, response, body) {
        // Handle any possible issues with the network request
        if (err) {
            return res.status(500).json({ message: "Error fetching blog data." });
        }
        // With a blog object in the body, render the page to edit it
        res.render('blog_edit', { 
            title: 'Edit Blog', 
            blog: body
        });
    });
};

//Blog Edit post
module.exports.blogUpdate = function(req, onSucceeded, onFailed) {
    var requestOptions, path, postdata;
    path = '/api/blogs/' + req.params.id;
    postdata = {
        blogTitle: req.body.blogTitle,
        blogText: req.body.blogText
    };
    requestOptions = {
        url: apiOptions.server + path,
        method: "PUT",
        json: postdata
    };
    request(requestOptions, function(err, response, body) {
        if (!err && response.statusCode === 200) {
            onSucceeded();
        } else {
            onFailed(err, response, body);
        }
    });
};


//Blog Delete
module.exports.blogDelete = function(req, res) {
    var requestOptions, path;
    path = '/api/blogs/' + req.params.id;
    requestOptions = {
        url: apiOptions.server + path,
        method: "DELETE",
        json: {}
    };
    request(requestOptions, 
        function(err, response, body) {
            renderDeletepage(req, res, body);
        }
    );
};

// Render blog delete page
var renderDeletepage = function(req, res, responseBody) {
    res.render('blog_delete', { 
        blogs: responseBody
    });
};

//Blog Delete post
module.exports.blogDeleteOne = function(req, res) {
    var requestOptions, path;
    path = `/api/blogs/${req.params.id}`;
    requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: "DELETE",
        json: {}
    };
    request(requestOptions, function(err, response, body) {
        if (response.statusCode === 204) {
            res.redirect('/blogList');
        } else {
            // Handle error, maybe render a page to show the error
            res.status(response.statusCode).send("Error deleting the blog post.");
        }
    });
};