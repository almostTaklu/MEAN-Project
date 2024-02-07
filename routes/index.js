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

module.exports = router;
