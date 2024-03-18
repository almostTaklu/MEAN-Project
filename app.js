require('dotenv').config(); // Load environment variables from .env
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');

require('./app_api/models/db');
require('./app_api/config/passport'); // Import passport configuration after model is defined

var routesApi = require('./app_api/routes/index');  // Import routes for the API

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));
app.use(passport.initialize());
app.use('/api', routesApi);

// Serve static assets (JS, CSS, and images) from the node_modules directory
// Note: You might adjust these routes based on your actual directory structure and requirements
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'angular')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'angular-route')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'angular-ui-router', 'release')));
app.use('/js', express.static(path.join(__dirname, 'app_client')));
app.use('/nav', express.static(path.join(__dirname, 'app_client', 'common', 'nav')));
app.use('/auth', express.static(path.join(__dirname, 'app_client', 'common', 'auth')));

// SPA base route: serves the entry point to your AngularJS app
app.use(function(req, res) {
    res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
    // Check if the error is from an API request and respond accordingly
    if (req.path.startsWith('/api/')) {
        // Respond with JSON for API errors
        res.status(err.status || 500).json({
            message: err.message,
            error: {}
        });
    } else {
        res.status(err.status || 500).json({
            message: "An error occurred",
            error: {}
        });
    }
});

module.exports = app;
