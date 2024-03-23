var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (username, password, done) => {
    try {
        const user = await User.findOne({ email: username });
        if (!user) {
            return done(null, false, {
                message: 'Incorrect email or password.'
            });
        }
        // Check if the password is valid
        if (!user.validPassword(password)) {
            return done(null, false, {
                message: 'Incorrect email or password.'
            });
        }
        // If everything is okay, proceed with the user object
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));
