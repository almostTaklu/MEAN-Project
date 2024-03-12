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
        .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

//Service for API calls
app.service('BlogService', ['$http', function($http) {
    var apiBaseUrl = '/api/blogs';

    this.listBlogs = function() {
        return $http.get(apiBaseUrl);
    };

    this.addBlog = function(blog) {
        return $http.post(apiBaseUrl, blog);
    };

    this.getBlog = function(blogId) {
        return $http.get(apiBaseUrl + '/' + blogId);
    };

    this.updateBlog = function(blogId, blog) {
        return $http.put(apiBaseUrl + '/' + blogId, blog);
    };

    this.deleteBlog = function(blogId) {
        return $http.delete(apiBaseUrl + '/' + blogId);
    };
}]);

//Controllers
app.controller('HomeController', [function() {
    var vm = this;
    vm.title = 'Ganga Acharya Blogsite';
    vm.message = 'Welcome to Ganga Acharya Blogsite';
}]);

//Controller for listing blogs
app.controller('ListController', ['BlogService', function(BlogService) {
    var vm = this;
    vm.blogs = [];
    vm.title = 'Blog List';

    BlogService.listBlogs().then(function(response) {
        vm.blogs = response.data;
    }, function(error) {
        console.error('Error fetching blogs:', error);
    });
}]);

// Controller for adding blogs
app.controller('AddController', ['$location', 'BlogService', function($location, BlogService) {
    var vm = this;
    vm.blog = {};
    vm.title = 'Add Blog';

    vm.addBlog = function() {
        BlogService.addBlog(vm.blog).then(function(response) {
            $location.path('/blogList');
        }, function(error) {
            console.error('Error adding blog:', error);
        });
    };
}]);

// Controller for editing blogs
app.controller('EditController', ['$routeParams', '$location', 'BlogService', function($routeParams, $location, BlogService) {
    var vm = this;
    var blogId = $routeParams.blogid;
    vm.blog = {};
    vm.title = 'Edit Blog';

    BlogService.getBlog(blogId).then(function(response) {
        vm.blog = response.data;
    }, function(error) {
        console.error('Error fetching blog:', error);
    });

    vm.updateBlog = function() {
        BlogService.updateBlog(blogId, vm.blog).then(function(response) {
            $location.path('/blogList');
        }, function(error) {
            console.error('Error updating blog:', error);
        });
    };
}]);

// Controller for deleting blogs
app.controller('DeleteController', ['$routeParams', '$location', 'BlogService', function($routeParams, $location, BlogService) {
    var vm = this;
    vm.blog = {};
    var blogId = $routeParams.blogid;
    vm.title = 'Delete Blog';

    BlogService.getBlog(blogId).then(function(response) {
        vm.blog = response.data;
    }, function(error) {
        console.error('Error fetching blog for deletion:', error);
    });

    vm.deleteBlog = function() {
        BlogService.deleteBlog(blogId).then(function(response) {
            $location.path('/blogList');
        }, function(error) {
            console.error('Error deleting blog:', error);
        });
    };
}]);