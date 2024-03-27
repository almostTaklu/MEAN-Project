var mongoose = require("mongoose");
var Blog = mongoose.model("Blog");

//utility function for sending JSON response
var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

// Create a blog
module.exports.blogCreate = async function (req, res) {
    console.log("Creating a blog");

    try {
        const newBlog = await Blog.create({
            blogTitle: req.body.blogTitle,
            blogText: req.body.blogText,
            createdOn: req.body.createdOn,
            author: req.body.author,
            authorEmail: req.body.authorEmail
        });
        sendJSONresponse(res, 201, newBlog);
    } catch (err) {
        console.log(err);
        sendJSONresponse(res, 400, err);
    }
};

// Read a blog
module.exports.blogReadOne = async function (req, res) {
    const blogId = req.params.blogid;
    console.log("Reading blog:", blogId);

    try {
        const blog = await Blog.findOne({_id: blogId});
        console.log("API:", blog);

        if (blog) {
            sendJSONresponse(res, 200, blog);
        } else {
            sendJSONresponse(res, 404, { "message": "Blog not found" });
        }
    } catch (err) {
        console.log(err);
        sendJSONresponse(res, 400, err);
    }
};

// Update a blog
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

// DELETE /api/
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

// Render blog list
const renderBlogList = function(req, res, responseBody) {
    // Use map to transform each blog into the desired format
    const blogs = responseBody.map(blog => ({
        blogTitle: blog.blogTitle,
        blogText: blog.blogText,
        createdOn: blog.createdOn,
        author: blog.author,
        authorEmail: blog.authorEmail,
        _id: blog._id
    }));

    return blogs;
};

// GET /api/blogs - Using async/await and renderBlogList for formatting
module.exports.blogList = async function (req, res) {
    console.log("Getting blogList");

    try {
        const blogs = await Blog.find().exec();

        if (!blogs || blogs.length === 0) {
            // If no blogs are found, send a 404 response with a message.
            return res.status(404).json({ "message": "blogs not found" });
        }

        // Use renderBlogList to format the blogs data before sending it
        const formattedBlogs = renderBlogList(req, res, blogs);

        // When blogs are found and formatted, send a 200 response with the formatted blogs data.
        res.status(200).json(formattedBlogs);
    } catch (err) {
        console.error(err);
        // If there's an error in the process, respond with a 500 status code and the error.
        res.status(500).json({ "message": "Error listing blogs", error: err });
    }
};
