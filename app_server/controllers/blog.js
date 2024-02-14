const Blog = require('../models/blogs')

//module.exports.blogList = async (req, res) => {
    // try{
    //     const blog = await Blog.find({}); // fetch all blog entries
    //     res.render('blog-list', {title: 'Blog List', blogs: blog});
    //     console.log("Imported Blog Model:", Blog);
    // } catch(err){
    //     console.error(err);
    //     res.status(500).send('Error fetching blog entries');
    // }
//}

module.exports.blogList = async (req, res) => {
    res.render('blog-list', { 
        title: 'Blog List', 
        blogs: [
            { blogTitle: "My First Blog Entry", blogText: "This is my first blog post!", createdOn: new Date() },
            { blogTitle: "Another Cool Post", blogText: "More interesting content goes here.", createdOn: new Date() },
            { blogTitle: "Another Cooler Post", blogText: "More interesting content goes here.", createdOn: new Date() },
        ]
    });
};


/* GET home page. */
module.exports.index = function(req, res) {
    res.render('index', { title: 'Ganga Acharya Blog Site'});
};

/* POST blog */
module.exports.blogAdd = function(req, res){
    res.render('blog-add', {title: 'Blog Add'});
}

module.exports.blogEdit = function(req, res) {
    const { id } = req.params; // Get the id from params
    console.log("Editing blog with id:", id);
    res.render('blog_edit', { title: 'Edit Blog', id });
};

module.exports.blogDelete = function(req, res) {
    const { id } = req.params; // Get the id from params
    console.log("Deleting blog with id:", id);
    res.render('blog_delete', { title: 'Delete Blog'});
};


// /* GET Blog edit page. */
// module.exports.blogEdit = function(req, res) {
//     //res.render('blog_edit', { title: 'Blog Edit'});
//     res.redirect('/blogList')
// };

// /* GET Blog delete page. */
// module.exports.blogDelete = function(req, res) {
//     res.render('blog_delete', { title: 'Blog Delete'});
// };