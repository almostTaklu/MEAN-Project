var app = angular.module('bloggerApp', ['ngRoute']);

//Router provider
app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/home.html',
            controller: 'HomeController',
            controllerAs: 'vm'
        })
        .when('/blogList', {
            templateUrl: '/blogList.html',
            controller: 'ListController',
            controllerAs: 'vm'
        })
        .when('/blogAdd', {
            templateUrl: '/blogAdd.html',
            controller: 'AddController',
            controllerAs: 'vm'
        })
        .when('/blogEdit/:blogid', {
            templateUrl: '/blogEdit.html',
            controller: 'EditController',
            controllerAs: 'vm'
        })
        .when('/blogDelete/:blogid', {
            templateUrl: '/blogDelete.html',
            controller: 'DeleteController',
            controllerAs: 'vm'
        })

        .when('/register', {
            templateUrl: '/register.html',
            controller: 'RegisterController',
            controllerAs: 'vm'
        })

        .when('/login', {
            templateUrl: '/login.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        })

        .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

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
                vm.message = 'Error adding blog ' + vm.blogId;
            });
        };
}]);

// Controller for editing blogs
app.controller('EditController', ['$routeParams', '$location', 'BlogService', 'authentication', 
    function EditController($routeParams, $location, BlogService, authentication) {
        var vm = this;
        var blogId = $routeParams.blogid;
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
app.controller('DeleteController', ['$routeParams', '$location', 'BlogService', 'authentication', 
    function DeleteController($routeParams, $location, BlogService, authentication) {
        var vm = this;
        vm.blog = {};
        var blogId = $routeParams.blogid;
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