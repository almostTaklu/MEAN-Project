var app = angular.module('bloggerApp', ['ui.router']);

//Router provider
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
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
app.service('BlogService', ['$http', 'authentication', function ($http, authentication) {
    var apiBaseUrl = '/api/blogs';

    var makeAuthHeader = function () {
        var token = authentication.getToken();
        return {
            headers: {
                Authorization: 'Bearer ' + token
            }
        };
    };

    this.listBlogs = function () {
        return $http.get(apiBaseUrl);
    };

    this.addBlog = function (blog) {
        return $http.post(apiBaseUrl, blog, makeAuthHeader());
    };

    this.getBlog = function (blogId) {
        return $http.get(apiBaseUrl + '/' + blogId);
    };

    this.updateBlog = function (blogId, blog) {
        return $http.put(apiBaseUrl + '/' + blogId, blog, makeAuthHeader());
    };

    this.deleteBlog = function (blogId) {
        return $http.delete(apiBaseUrl + '/' + blogId, makeAuthHeader());
    };

    this.addComment = function (blogId, comment) {
        return $http.post(apiBaseUrl + '/' + blogId + '/comments', comment, makeAuthHeader());
    };

    this.getComments = function (blogId) {
        return $http.get(apiBaseUrl + '/' + blogId + '/comments');
    };

    this.addReply = function (blogId, commentId, reply) {
        return $http.post(apiBaseUrl + '/' + blogId + '/comments/' + commentId + '/replies', reply, makeAuthHeader());
    };

    this.likeComment = function (blogId, commentId) {
        return $http.post(apiBaseUrl + '/' + blogId + '/comments/' + commentId + '/like', {}, makeAuthHeader());
    };

    this.dislikeComment = function (blogId, commentId) {
        return $http.post(apiBaseUrl + '/' + blogId + '/comments/' + commentId + '/dislike', {}, makeAuthHeader());
    };
}]);

//Controllers
app.controller('HomeController', [function () {
    var vm = this;
    vm.title = 'Ganga Acharya Blogsite';
    vm.message = 'This is my blogsite for Web Development class at Millersville University';
}]);

//Controller for listing blogs
app.controller('ListController', ['BlogService', 'authentication',
    function ListController(BlogService, authentication) {
        var vm = this;
        vm.title = 'Blog List';

        vm.isLoggedIn = function () {
            return authentication.isLoggedIn();
        };

        vm.logout = function () {
            authentication.logout();
        };

        vm.currentUser = function () {
            return authentication.currentUser();
        };

        console.log('Is Logged In:', vm.isLoggedIn());
        console.log('Current User:', vm.currentUser());

        BlogService.listBlogs().then(function (response) {
            vm.blogs = response.data;
            vm.message = "Blogs found";
        }, function (error) {
            vm.message = 'Error fetching blog ';
        });
    }]);

// Controller for viewing a blog
app.controller('ViewController', ['$stateParams', 'BlogService', 'authentication', '$interval', function ViewController($stateParams, BlogService, authentication, $interval) {
    var vm = this;
    vm.blog = { comments: [] };
    vm.newCommentText = '';
    vm.newReplyTexts = {};  // Object to hold replies for different comments
    vm.showButtons = false;
    vm.replyVisibility = {};  // Added to track visibility state of each reply form

    function refreshBlog() {
        BlogService.getBlog($stateParams.blogid).then(function (response) {
            let newData = response.data;
            // Update the blog data but preserve comments' reply visibility and text areas
            vm.blog.blogTitle = newData.blogTitle;
            vm.blog.blogText = newData.blogText;
            vm.blog.author = newData.author;
            vm.blog.createdOn = newData.createdOn;

            newData.comments.forEach(newComment => {
                let existingComment = vm.blog.comments.find(c => c._id === newComment._id);
                if (existingComment) {
                    // Update details but preserve UI states
                    existingComment.likes = newComment.likes;
                    existingComment.dislikes = newComment.dislikes;
                    existingComment.replies = newComment.replies;
                } else {
                    // New comment found, add to array
                    vm.blog.comments.push(newComment);
                    vm.newReplyTexts[newComment._id] = '';  // Initialize reply textarea
                    vm.replyVisibility[newComment._id] = false;  // Initialize reply visibility
                }
            });

            // Remove comments that no longer exist in the new data
            vm.blog.comments = vm.blog.comments.filter(c => newData.comments.some(nc => nc._id === c._id));
        }, function (error) {
            console.error('Error fetching blog:', error);
        });
    }

    // Initial fetch and setup interval
    refreshBlog();
    var refreshInterval = $interval(refreshBlog, 3000);

    vm.$onDestroy = function () {
        $interval.cancel(refreshInterval);
    };

    // Manage reply form visibility
    vm.toggleReplyForm = function(commentId) {
        vm.replyVisibility[commentId] = !vm.replyVisibility[commentId];
    };

    // Function to cancel the reply
    vm.cancelReply = function(commentId) {
        vm.newReplyTexts[commentId] = '';  // Clear the textarea
        var commentIndex = vm.blog.comments.findIndex(c => c._id === commentId);
        if(commentIndex >= 0) {
            vm.blog.comments[commentIndex].showReply = false;
        }
    };

        // Function to add a comment
    vm.addComment = function () {
        if (!vm.newCommentText.trim()) {
            alert("Comment cannot be empty.");
            return;
        }
        var comment = {
            commentText: vm.newCommentText,
            author: authentication.currentUser().name,
            authorEmail: authentication.currentUser().email
        };
        BlogService.addComment($stateParams.blogid, comment).then(function (response) {
            vm.blog.comments.push(response.data);
            $timeout(function () {
                vm.newCommentText = '';
                vm.showButtons = false;
            });
        }, function (error) {
            console.error('Error adding comment:', error);
        });
    };

    // Function to add a reply
    vm.addReply = function (commentId) {
        if (!vm.newReplyTexts[commentId].trim()) {
            alert("Reply cannot be empty.");
            return;
        }
        var reply = {
            commentText: vm.newReplyTexts[commentId],
            author: authentication.currentUser().name,
            authorEmail: authentication.currentUser().email
        };
        BlogService.addReply($stateParams.blogid, commentId, reply).then(function (response) {
            var comment = vm.blog.comments.find(c => c._id === commentId);
            if (comment) {
                comment.replies.push(response.data);
                $timeout(function () {
                    vm.newReplyTexts[commentId] = '';
                    vm.replyVisibility[commentId] = false;
                });
            }
        }, function (error) {
            console.error('Error adding reply:', error);
        });
    };

    // Function to like a comment
    vm.likeComment = function (comment) {
        // Check if the user has already liked the comment
        var hasAlreadyLiked = vm.hasLiked(comment);
        BlogService.likeComment($stateParams.blogid, comment._id)
            .then(function (response) {
                // Toggle the like
                if (hasAlreadyLiked) {
                    // User unlikes the comment
                    comment.likes--;
                } else {
                    // User likes the comment
                    comment.likes++;
                    if (vm.hasDisliked(comment)) {
                        // If previously disliked, decrease the dislikes count
                        comment.dislikes--;
                    }
                }
                // Update the user reactions list to reflect this change
                updateReactions(comment, 'like', hasAlreadyLiked);
            })
            .catch(function (error) {
                console.error('Error processing like:', error);
            });
    };

    // Function to dislike a comment
    vm.dislikeComment = function (comment) {
        // Check if the user has already disliked the comment
        var hasAlreadyDisliked = vm.hasDisliked(comment);
        BlogService.dislikeComment($stateParams.blogid, comment._id)
            .then(function (response) {
                // Toggle the dislike
                if (hasAlreadyDisliked) {
                    // User undislikes the comment
                    comment.dislikes--;
                } else {
                    // User dislikes the comment
                    comment.dislikes++;
                    if (vm.hasLiked(comment)) {
                        // If previously liked, decrease the likes count
                        comment.likes--;
                    }
                }
                // Update the user reactions list to reflect this change
                updateReactions(comment, 'dislike', hasAlreadyDisliked);
            })
            .catch(function (error) {
                console.error('Error processing dislike:', error);
            });
    };

    // Function to check if the user has liked a comment
    vm.hasLiked = function (comment) {
        var userId = authentication.currentUser()._id;
        return comment.userReactions && comment.userReactions.some(function (reaction) {
            return reaction.userId === userId && reaction.reaction === 'like';
        });
    };

    // Function to check if the user has disliked a comment
    vm.hasDisliked = function (comment) {
        var userId = authentication.currentUser()._id;
        return comment.userReactions && comment.userReactions.some(function (reaction) {
            return reaction.userId === userId && reaction.reaction === 'dislike';
        });
    };

    // Utility function to update the reactions array
    function updateReactions(comment, reactionType, hasAlreadyReacted) {
        var userId = authentication.currentUser()._id;
        if (hasAlreadyReacted) {
            // Remove the reaction from the userReactions array
            comment.userReactions = comment.userReactions.filter(function (reaction) {
                return reaction.userId !== userId;
            });
        } else {
            // Add or change the reaction in the userReactions array
            var existingReaction = comment.userReactions.find(function (reaction) {
                return reaction.userId === userId;
            });
            if (existingReaction) {
                existingReaction.reaction = reactionType;
            } else {
                comment.userReactions.push({
                    userId: userId,
                    reaction: reactionType
                });
            }
        }
    }

    // Function to show the buttons
    vm.cancelComment = function () {
        vm.newCommentText = '';
        vm.showButtons = false;
    };

    // Function to check if the user is logged in
    vm.isLoggedIn = function () {
        return authentication.isLoggedIn();
    };

    vm.checkBlur = function () {
        if (!vm.newCommentText.trim()) {
            $timeout(function () {
                vm.showButtons = false;
            });
        }
    };
    
}]);

// Controller for adding blogs
app.controller('AddController', ['$location', 'BlogService', 'authentication',
    function AddController($location, BlogService, authentication) {
        var vm = this;
        vm.blog = {};
        vm.title = 'Add Blog';

        vm.submitBlog = function () {
            var currentUser = authentication.currentUser();
            vm.blog.author = currentUser.name;
            vm.blog.authorEmail = currentUser.email;

            console.log('Adding blog:', vm.blog);   //debugging

            BlogService.addBlog(vm.blog)
                .then(function (response) {
                    vm.message = 'Blog added successfully';
                    $location.path('/blogList');
                }, function (error) {
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

        BlogService.getBlog(blogId).then(function (response) {
            vm.blog = response.data;
        }, function (error) {
            console.error('Error fetching blog:', error);
        });

        vm.editBlog = function () {
            BlogService.updateBlog(blogId, vm.blog).then(function (response) {
                $location.path('/blogList');
            }, function (error) {
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

        BlogService.getBlog(blogId).then(function (response) {
            vm.blog = response.data;
            vm.message = "Blog found";
        }, function (error) {
            vm.message = 'Error fetching blog' + vm.blogId + 'for deletion';
        });

        vm.deleteBlog = function () {
            BlogService.deleteBlog(blogId).then(function (response) {
                $location.path('/blogList');
            }, function (error) {
                vm.message = 'Error deleting blog ' + vm.blogId;
            });
        };
    }]);