var mongoose = require("mongoose");
var Blog = mongoose.model("Blog");
var errorHandlers = require("../../public/javascript/error.js");

//utility function for sending JSON response
var sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

// List all blogs
module.exports.blogList = function (req, res) {
  Blog.find({})
    .then((blogs) => {
      sendJSONresponse(res, 200, blogs);
    })
    .catch((err) => {
      sendJSONresponse(res, 404, err);
    });
};

// create a new blog
module.exports.blogCreate = async function (req, res) {
  try {
    const blog = await Blog.create({
      blogTitle: req.body.blogTitle,
      blogText: req.body.blogText,
      //createdOn: req.body.createdOn
    });
    res.redirect("/blogList");
  } catch (err) {
    res.status(400).json({ error: "Blog creation failed. Please try again." });
  }
};

//Read a single blog by ID
module.exports.blogReadOne = function (req, res) {
  if (req.params && req.params.id) {
    Blog.findById(req.params.id).exec((err, blog) => {
      if (!blog) {
        sendJSONresponse(res, 404, {
          message: "blog id not found",
        });
        return;
      } else if (err) {
        sendJSONresponse(res, 404, err);
        return;
      }
      sendJSONresponse(res, 200, blog);
    });
  } else {
    sendJSONresponse(res, 404, {
      message: "No blog id in request",
    });
  }
};

//Update a blog
module.exports.blogUpdateOne = async function (req, res) {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        blogTitle: req.body.blogTitle,
        blogText: req.body.blogText,
      },
      { new: true }
    ); // { new: true } returns the updated document

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (err) {
    res.status(400).json({ message: "Error updating blog" });
  }
};

module.exports.blogDeleteOne = async function (req, res) {
  try {
    const result = await Blog.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(204).json(null); // 204 No Content
  } catch (err) {
    res.status(400).json({ message: "Error deleting blog" });
  }
};
