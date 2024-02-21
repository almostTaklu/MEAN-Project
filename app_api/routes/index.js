var express = require('express');
var router = express.Router();
var ctrlBlog = require('../controllers/blogApiCtrl')

/* blog controller */
router.get('/blogs', ctrlBlog.blogList);
router.post('/blogs', ctrlBlog.blogCreate);
router.get('/blogs/:id', ctrlBlog.blogReadOne);
router.put('/blogs/:id', ctrlBlog.blogUpdateOne);
router.delete('/blogs/:id', ctrlBlog.blogDeleteOne);

module.exports = router;

