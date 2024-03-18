var app = angular.module('bloggerApp');

//Authentication service and methods
app.service('authentication', ['$http', '$window', function($http, $window) {
    var saveToken = function(token) {
        $window.localStorage['blogger-token'] = token;
    };

    //Get token from local storage
    var getToken = function(){
        return $window.localStorage ['blogger-token'];
    };

    //Register user
    var register = function(user){
        console.log('Registering user ' + user.email + ' ' + user.password);
        return $http.post('/api/register', user).then(function(response){
            saveToken(response.data.token);
        });
    }

    //Login user
    var login = function(user){
        console.log('Logging in user ' + user.email + ' ' + user.password);
        return $http.post('/api/login', user).then(function(response){
            saveToken(response.data.token);
        });
    };

    //Logout user
    var logout = function(){
        $window.localStorage.removeItem('blogger-token');
    };

    // Check if the user is logged in
var isLoggedIn = function() {
    var token = getToken();
    // Make sure the token is not null or empty before decoding
    if(token) {
        try {
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        } catch (e) {
            // Handle decoding error or token format issues
            console.error("Error decoding token: ", e);
            return false;
        }
    } else {
        // If there is no token, the user is not logged in
        return false;
    }
};


    //Get current user
    var currentUser = function(){
        if(isLoggedIn()){
            var token = getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return {
                email : payload.email,
                name : payload.name
            };
        }
    };

    //Return methods
    return {
        saveToken : saveToken,
        getToken : getToken,
        register : register,
        login : login,
        logout : logout,
        isLoggedIn : isLoggedIn,
        currentUser : currentUser
    };
}]);

//login controller
app.controller('LoginController', ['$http','$location', 'authentication', 
    function LoginController($http, $location, authentication){
        var vm = this;
        vm.title = 'Login to Blogger';

        //Check if user is logged in
        vm.credentials = {
            email : "",
            password : ""
        };

        vm.returnPage = $location.search().page || '/';

        //Submit form
        vm.onSubmit = function(){
            vm.formError = "";
            if(!vm.credentials.email || !vm.credentials.password){
                vm.formError = "All fields required, please try again";
                return false;
            } else {
                vm.doLogin();
            }
        };

        //Login user
        vm.doLogin = function(){
            vm.formError = "";
            authentication
                .login(vm.credentials)
                .then(function(){
                    $location.search('page', null);
                    $location.path(vm.returnPage);
                }, function(err){
                    vm.formError = err.data.message;
                });
        };
}]);

//Controller for registering user
app.controller('RegisterController', ['$location', 'authentication', 
    function RegisterController($location, authentication){
        var vm = this;
        vm.title = 'Register new Blogger account';

        //Check if user is logged in
        vm.credentials = {
            name : "",
            email : "",
            password : ""
        };

        vm.returnPage = $location.search().page || '/';
        
        //Submit form
        vm.onRegister = function(){
            vm.formError = "";
            if(!vm.credentials.name || !vm.credentials.email || !vm.credentials.password){
                vm.formError = "All fields required, please try again";
                return false;
            } else {
                vm.doRegister();
            }
        };

        //Register user
        vm.doRegister = function(){
            vm.formError = "";
            authentication
                .register(vm.credentials)
                .then(function(){
                    $location.search('page', null);
                    $location.path(vm.returnPage);
                }, function(err){
                    vm.formError = "Error registering user, please try again with a different email address.";
                });
        };
}]);
