var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

var auth = jwt({
	secret: process.env.JWT_SECRET,
	userProperty: 'payload'
});

var ctrlBlog = require('../controllers/blogApiCtrl')
var ctrlAuth = require('../controllers/authentication');

// Define routes for blog operations
router.get('/blogs', ctrlBlog.blogList);    // GET /api/blogs
router.post('/blogs', auth, ctrlBlog.blogCreate); // POST /api/blogs
router.get('/blogs/:blogid', ctrlBlog.blogReadOne); // GET /api/blogs/:blogid
router.put('/blogs/:blogid', auth, ctrlBlog.blogUpdateOne); // PUT /api/blogs/:blogid
router.delete('/blogs/:blogid', auth, ctrlBlog.blogDeleteOne);    // DELETE /api/blogs/:blogid

// Define routes for authentication
router.post('/register', ctrlAuth.register); // POST /api/register
router.post('/login', ctrlAuth.login);  // POST /api/login

module.exports = router;