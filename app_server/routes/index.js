var express = require('express');
var router = express.Router();

/* blog controller */
var blog = require('../controllers/blog')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Ganga Acharya Blog Site' });
});

/* GET/POST blog page. */
router.get('/blogList', blog.blogList);
router.get('/blogAdd', blog.blogAdd);

// Add Edit and Delete Routes 
router.get('/blogs/edit/:id', blog.blogEdit);  
router.get('/blogs/delete/:id', blog.blogDelete);

// Add Update Route
router.post('/blogUpdate/:id', blog.blogUpdate);

// Add Create Route
router.delete('/blogDelete/:id', blog.blogDeleteOne);




module.exports = router;
