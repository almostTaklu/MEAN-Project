var app = angular.module('bloggerApp', ['ui.router']);

//Router provider
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/home.html',
            controller: 'HomeController',
            controllerAs: 'vm',
            data: { title: 'Home' }
        })
        .state('blogList', {
            url: '/blogList',
            templateUrl: '/blogList.html',
            controller: 'ListController',
            controllerAs: 'vm',
            data: { title: 'Blog List' }
        })
        .state('blogAdd', {
            url: '/blogAdd',
            templateUrl: '/blogAdd.html',
            controller: 'AddController',
            controllerAs: 'vm',
            data: { title: 'Add New Blog' }
        })
        .state('blogEdit', {
            url: '/blogEdit/:blogid',
            templateUrl: '/blogEdit.html',
            controller: 'EditController',
            controllerAs: 'vm',
            data: { title: 'Edit Blog' }
        })
        .state('blogDelete', {
            url: '/blogDelete/:blogid',
            templateUrl: '/blogDelete.html',
            controller: 'DeleteController',
            controllerAs: 'vm',
            data: { title: 'Delete Blog' }
        })
        .state('register', {
            url: '/register',
            templateUrl: '/register.html',
            controller: 'RegisterController',
            controllerAs: 'vm',
            data: { title: 'Register' }
        })
        .state('login', {
            url: '/login',
            templateUrl: '/login.html',
            controller: 'LoginController',
            controllerAs: 'vm',
            data: { title: 'Login' }
        })
        .state('blogView', {
            url: '/blogView/:blogid',
            templateUrl: '/blogView.html',
            controller: 'ViewController',
            controllerAs: 'vm',
            data: { title: 'View Blog' }
        });

    // Default fallback for unmatched urls
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);


//Service for API calls
app.service('BlogService', ['$http', 'authentication', function($http, authentication) {
    var apiBaseUrl = '/api/blogs';

    var makeAuthHeader = function() {
        var token = authentication.getToken();
        return { headers: { 
            Authorization: 'Bearer ' + token } };
    };

    this.listBlogs = function() {
        return $http.get(apiBaseUrl);
    };

    this.addBlog = function(blog) {
        return $http.post(apiBaseUrl, blog, makeAuthHeader() );
    };

    this.getBlog = function(blogId) {
        return $http.get(apiBaseUrl + '/' + blogId);
    };

    this.updateBlog = function(blogId, blog) {
        return $http.put(apiBaseUrl + '/' + blogId, blog, makeAuthHeader() );
    };

    this.deleteBlog = function(blogId) {
        return $http.delete(apiBaseUrl + '/' + blogId, makeAuthHeader() );
    };

    this.addComment = function(blogId, comment) {
        return $http.post(apiBaseUrl + '/' + blogId + '/comments', comment, makeAuthHeader() );
    };

    this.getComments = function(blogId) {
        return $http.get(apiBaseUrl + '/' + blogId + '/comments');
    };

    this.addReply = function(blogId, commentId, reply) {
        return $http.post(apiBaseUrl + '/' + blogId + '/comments/' + commentId + '/replies', reply, makeAuthHeader());
    };
}]);

//Controllers
app.controller('HomeController', [function() {
    var vm = this;
    vm.title = 'Ganga Acharya Blogsite';
    vm.message = 'Blogsite for Web Development class';
}]);

//Controller for listing blogs
app.controller('ListController', ['BlogService','authentication', 
    function ListController(BlogService, authentication) {
        var vm = this;
        vm.title = 'Blog List';

        vm.isLoggedIn = function() {
            return authentication.isLoggedIn();
        };

        vm.logout = function() {
            authentication.logout();
        };

        vm.currentUser = function() {
            return authentication.currentUser();
        };

        console.log('Is Logged In:', vm.isLoggedIn());
        console.log('Current User:', vm.currentUser());

        BlogService.listBlogs().then(function(response) {
            vm.blogs = response.data;
            vm.message = "Blogs found";
        }, function(error) {
            vm.message = 'Error fetching blog ';
        });
}]);

// Controller for viewing a blog
app.controller('ViewController', ['$stateParams', 'BlogService', 'authentication', function ViewController($stateParams, BlogService, authentication) {
    var vm = this;
    vm.blog = {};
    vm.newCommentText = '';
    vm.newReplyTexts = {};  // Object to hold replies for different comments

    BlogService.getBlog($stateParams.blogid).then(function(response) {
        vm.blog = response.data;
    }, function(error) {
        console.error('Error fetching blog:', error);
    });

    vm.addComment = function() {
        var comment = {
            commentText: vm.newCommentText,
            author: authentication.currentUser().name,
            authorEmail: authentication.currentUser().email
        };
        BlogService.addComment($stateParams.blogid, comment).then(function(response) {
            vm.blog.comments.push(response.data);
            vm.newCommentText = ''; // Clear the textarea after posting
        }, function(error) {
            console.error('Error adding comment:', error);
        });
    };

    // Add a reply to a specific comment
    vm.addReply = function(commentId) {
        var reply = {
            commentText: vm.newReplyTexts[commentId],
            author: authentication.currentUser().name,
            authorEmail: authentication.currentUser().email
        };
        BlogService.addReply($stateParams.blogid, commentId, reply).then(function(response) {
            // Find the comment by ID and add the reply
            var comment = vm.blog.comments.find(c => c._id === commentId);
            if(comment) {
                comment.replies.push(response.data);
            }
            vm.newReplyTexts[commentId] = ''; // Clear the textarea after posting
        }, function(error) {
            console.error('Error adding reply:', error);
        });
    };

    vm.isLoggedIn = function() {
        return authentication.isLoggedIn();
    };
}]);


// Controller for adding blogs
app.controller('AddController', ['$location', 'BlogService', 'authentication', 
    function AddController($location, BlogService, authentication) {
        var vm = this;
        vm.blog = {};
        vm.title = 'Add Blog';

        vm.submitBlog = function() {
            var currentUser = authentication.currentUser();
            vm.blog.author = currentUser.name;
            vm.blog.authorEmail = currentUser.email;

            console.log('Adding blog:', vm.blog);   //debugging

            BlogService.addBlog(vm.blog)
                .then(function(response) {
                    vm.message = 'Blog added successfully';
                    $location.path('/blogList');
            }, function(error) {
                console.error('Error adding blog:', error);
                vm.message = 'Error adding blog ' + vm.blogId;
            });
        };
}]);

// Controller for editing blogs
app.controller('EditController', ['$stateParams', '$location', 'BlogService', 'authentication', 
    function EditController($stateParams, $location, BlogService, authentication) {
        var vm = this;
        var blogId = $stateParams.blogid;
        vm.blog = {};
        vm.title = 'Edit Blog';

        BlogService.getBlog(blogId).then(function(response) {
            vm.blog = response.data;
        }, function(error) {
            console.error('Error fetching blog:', error);
        });

        vm.editBlog = function() {
            BlogService.updateBlog(blogId, vm.blog).then(function(response) {
                $location.path('/blogList');
            }, function(error) {
                vm.message = 'Error updating blog ' + vm.blogId;
            });
        };
}]);

// Controller for deleting blogs
app.controller('DeleteController', ['$stateParams', '$location', 'BlogService', 'authentication', 
    function DeleteController($stateParams, $location, BlogService, authentication) {
        var vm = this;
        vm.blog = {};
        var blogId = $stateParams.blogid;
        vm.title = 'Delete Blog';

        BlogService.getBlog(blogId).then(function(response) {
            vm.blog = response.data;
            vm.message = "Blog found";
        }, function(error) {
            vm.message = 'Error fetching blog' + vm.blogId + 'for deletion';
        });

        vm.deleteBlog = function() {
            BlogService.deleteBlog(blogId).then(function(response) {
                $location.path('/blogList');
            }, function(error) {
                vm.message = 'Error deleting blog ' + vm.blogId;
            });
        };
}]);