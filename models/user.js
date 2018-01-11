var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var User = mongoose.Schema({
  local : {
    email        : String,
    password     : String,
  }
});
// Using the User.methods.encrypt set to a function (bcrypt.hashSync)
User.methods.encrypt = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};
// Using the User.methods.validPassword set to a function that compares to the encrypted pword with compareSync
User.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);	
};

module.exports = mongoose.model('User', User);