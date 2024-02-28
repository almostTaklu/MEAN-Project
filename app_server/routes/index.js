var express = require('express');
var router = express.Router();

/* blog controller */
var blogCtrl = require('../controllers/blog')
var ctrlHome = require('../controllers/home')

/* GET home page. */
router.get('/', ctrlHome.index);

/* GET blogList page. */
router.get('/blogList', blogCtrl.blogList);

/* GET blogCreate page. */
router.get('/blogAdd', blogCtrl.blogAdd);
/* POST blogCreate page. */
router.post('/blogAdd', blogCtrl.doAddBlog);

/* GET blogReadOne page. */
router.get('/blogEdit/:blogid', blogCtrl.editBlog);
/* GET blogUpdateOne page. */
router.post('/blogEdit/:blogid', blogCtrl.doEditBlog);

/* GET blogDeleteOne page. */
router.get('/blogDelete/:blogid', blogCtrl.deleteBlog);
/* POST blogDeleteOne page. */
router.post('/blogDelete/:blogid', blogCtrl.doDeleteBlog);


module.exports = router;
