// REQUIRING passport-local
var LocalStrategy = require('passport-local').Strategy;
// REQUIRING THE USE OF THE FOLDER MODELS/USER
var User = require('../models/user');

// EXPORTING A FUNCTION(passport)
module.exports = function(passport){
	
	passport.serializeUser(function(user, callback) {
		callback(null, user.id);
	
	});

	passport.deserializeUser(function(id, callback) {
		User.findById(id, function(err, user) {
			callback(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	},  function(req, email, password, callback) {
		// Where we are gonna customize the passport new account signup functionality
		// For example, checking to see if the user already has an account with a password
		User.findOne({ 'local.email' : email }, function(err, user) {
			if (err) return callback(err);

			if (user) {
				return callback(null, false, req.flash('signupMessage', 'This email is already used.'));
			} else {
				// Ther'es no document in the DB with this email, so we're gonna make one
				var newUser = new User();
				newUser.local.email = email;
				newUser.local.password = newUser.encrypt(password);

				newUser.save(function(err){
					if(err) throw err;
					return callback(null, newUser);
				});
			}	
			
		});
	


	}));
		// SIGN IN LOCAL STRATEGY
	passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	}, function(req, email, password, callback) {
		// SEARCH FOR AN USER WITH THIS EMAIL
		User.findOne({ 'local.email' : email }, function(err, user) {
			if (err) return callback(err);
		// IF NO USER FOUND
			if(!user) {
				return callback(null, false, req.flash('loginMessage', 'No user found.'));
			}
		// WRONG PASSWORD
			if(!user.validPassword(password)) {
				return callback(null, false, req.flash('loginMessage', 'OOPS, Wrong Password.'));
			}
			
			return callback(null, user);
		});

	}));

};


























// end of code