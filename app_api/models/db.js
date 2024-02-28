var mongoose = require('mongoose')
require('dotenv').config(); // Load environment variables from .env

//Database connection
var dbURI = process.env.DB_URL
mongoose.connect(dbURI);

// Monitor and report when database is connected                      
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});
// Monitor and report error connecting to database
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});

// Monitor and report when database is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});
// Closes (disconnects) from Mongoose DB upon shutdown    
const gracefulShutdown = async (msg) => {
    try {
        await mongoose.connection.close();
        console.log('Mongoose disconnected through ' + msg);
    } catch (err) {
        console.error('Mongoose disconnection error: ', err);
    }
};

// For nodemon restarts
process.once('SIGUSR2', async () => {
    await gracefulShutdown('nodemon restart');
    process.kill(process.pid, 'SIGUSR2');
});

// For app termination
process.on('SIGINT', async () => {
    await gracefulShutdown('app termination');
    process.exit(0);
});

// For Heroku app termination
process.on('SIGTERM', async () => {
    await gracefulShutdown('Heroku app shutdown');
    process.exit(0);
});


//Bring in schema and models
require('./blogs');