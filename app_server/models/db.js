var mongoose = require('mongoose')
require('dotenv').config(); // Load environment variables from .env

//Database connection
var dbURI = process.env.DB_URL
mongoose.connect(dbURI);

// Monitor and report when database is connected
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbURI);
});

// Monitor and report error connecting database
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err );
});

// Monitor and report when database is disconnected
mongoose.connection.on('Disconnected', function () {
    console.log('Mongoose disconnected');
});

// Closes (disconnects) from Mongoose db upon shutdown
var gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected though ' + msg);
        callback();
    });
};

// For nodemon restarts
process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// For app termination
process.on('SIGINT', function() {
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});

// For Heroku app shutdown
process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app shutdown', function() {
        process.exit(0);
    });
});

//Bring in schema and models
require('./blogs');