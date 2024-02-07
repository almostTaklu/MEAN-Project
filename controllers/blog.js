/* GET home page. */
module.exports.index = function(req, res) {
    res.render('index', { title: 'Ganga Acharya Blog Site'});
};

/* GET blog page */
module.exports.blogList = function(req, res){
    res.render('blog-list', {title: 'Blog List'});
}

/* POST blog */
module.exports.blogAdd = function(req, res){
    res.render('blog-add', {title: 'Blog Add'});
}