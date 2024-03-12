var app = angular.module('bloggerApp', ['ngRoute']);

//Router provider
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'HomeController',
            controllerAs: 'vm'
        })
        .when('/blogList', {
            templateUrl: 'pages/blogList.html',
            controller: 'ListController',
            controllerAs: 'vm'
        })
        .when('/blogAdd', {
            templateUrl: 'pages/blogAdd.html',
            controller: 'AddController',
            controllerAs: 'vm'
        })
        .when('/blogEdit/:blogid', {
            templateUrl: 'pages/blogEdit.html',
            controller: 'EditController',
            controllerAs: 'vm'
        })
        .when('/blogDelete/:blogid', {
            templateUrl: 'pages/blogDelete.html',
            controller: 'DeleteController',
            controllerAs: 'vm'
        })
        .otherwise({redirectTo: '/'});
});

