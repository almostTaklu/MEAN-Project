var express = require('express');
var router = express.Router();
var ctrlBlog = require('../controllers/blogApiCtrl')

// Define routes for blog operations
router.get('/blogs', ctrlBlog.blogList);    // GET /api/blogs
router.post('/blogs', ctrlBlog.blogCreate); // POST /api/blogs
router.get('/blogs/:blogid', ctrlBlog.blogReadOne); // GET /api/blogs/:blogid
router.put('/blogs/:blogid', ctrlBlog.blogUpdateOne); // PUT /api/blogs/:blogid
router.delete('/blogs/:blogid', ctrlBlog.blogDeleteOne);    // DELETE /api/blogs/:blogid

module.exports = router;