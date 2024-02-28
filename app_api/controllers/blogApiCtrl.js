var mongoose = require("mongoose");
var Blog = mongoose.model("Blog");

//utility function for sending JSON response
var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

// Create a new blog
module.exports.blogCreate = function (req, res) {
    console.log("Creating a blog");
    Blog.create({
        blogTitle: req.body.blogTitle,
        blogText: req.body.blogText
    })
    .then(function (newBlog) {
        sendJSONresponse(res, 201, newBlog);
    })
    .catch(function (err) {
        sendJSONresponse(res, 400, err);
    });
};

// Read One blog
module.exports.blogReadOne = function (req, res) {
    var blogId = req.params.blogid;
    console.log("API finding blog: "+blogId)
    Blog.findOne({_id:blogId})
    .then(function(blog) {
        console.log("API: "+blog)
        if (blog) {
            sendJSONresponse (res, 200, blog);
        } else {
            sendJSONresponse (res, 404, blog);
        }
    })
    .catch(function(err) {
        console.log(err);
        sendJSONresponse (res, 400, err);

    })
};

//
module.exports.blogUpdateOne = async function (req, res) {
    const blogId = req.params.blogid;
    console.log('Updating blog with ID:', blogId);

    const updates = {
        $set: {
            blogTitle: req.body.blogTitle,
            blogText: req.body.blogText
        }
    };

    try {
        const blog = await Blog.findByIdAndUpdate(blogId, updates, { new: true });
        if (!blog) {
            console.log(`No blog found with ID ${blogId}`);
            return sendJSONresponse(res, 404, { "message": "Blog not found" });
        }
        sendJSONresponse(res, 200, blog);
    } catch (err) {
        console.log('Error updating blog:', err);
        sendJSONresponse(res, 400, err);
    }
};



//Delete one blog
module.exports.blogDeleteOne = async function (req, res) {
    const blogId = req.params.blogid;
    console.log("Deleting blog with id " + blogId);
    try {
        const blog = await Blog.findByIdAndDelete(blogId).exec();
        if (!blog) {
            console.log("Blog not found with id: " + blogId);
            sendJSONresponse(res, 404, { "message": "Blog not found" });
            return;
        }
        console.log("Blog id " + blogId + " deleted");
        sendJSONresponse(res, 204, null);
    } catch (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
    }
};


// Render the list of blogs
var renderBlogList = function (req, res, responseBody) {
    var blogs = [];
    responseBody.forEach(function (blog) {
        blogs.push({
            blogTitle: blog.blogTitle,
            blogText: blog.blogText,
            _id: blog._id
        });
    });
    return blogs;
}

// List of blogs
module.exports.blogList = function (req, res) {
    console.log("Getting blogList");
    Blog.find().exec()
        .then(blogs => {
            if (!blogs) {
                sendJSONresponse(res, 404, {"message": "blogs not found"});
                return;
            }
            console.log(blogs);
            sendJSONresponse(res, 404, blogs);
            return;
        })
        .catch(err => {
            sendJSONresponse(res, 200, renderBlogList(req, res, err));
        });
};