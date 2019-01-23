/*jshint esversion: 6 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


let UserSchema = mongoose.Schema({
  username:{
    type: String,
    index: true
  },
  password:{
    type: String
  },
  email:{
    type: String
  },
  name:{
    type:String
  }
});

let User = module.exports = mongoose.model('User', UserSchema);


// Encrypts password and saves user into db.
module.exports.createUser = function(newUser, callback){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};


// Finds user by username.
module.exports.getUserByUsername = function(username, callback){
  let query = {username: username};
  User.findOne(query, callback);
};

// Finds user by ID.
module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
};

// Compares password with retrieved user from database. 
module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch){
    if (err) throw err;
    callback(null, isMatch);
  });
};
