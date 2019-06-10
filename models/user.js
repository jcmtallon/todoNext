/*jshint esversion: 6 */
const appConfig = require('./../appConfig/appConfig');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserOptionsSchema = require('./userOptions');


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
    type: String
  },
  options: UserOptionsSchema
});


let targetCollection = (appConfig.production) ? 'prodUsers' : 'Users';

let User = module.exports = mongoose.model(targetCollection, UserSchema);


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


// Finds user by email.
module.exports.getUserByEmail = function(email, callback){
  let query = {email: email};
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


//------------------ Active task methods ----------------//

// Updates target task with passed modifications.
module.exports.patchById = function(id, request, callback){

  User.findById(id, function (err, user) {
    if (err) return next(err);

    for (let k in request){
      if (request.hasOwnProperty(k)) {
        user.options[k] = request[k];
      }
    }

    user.save(callback);
  });

};


module.exports.removeActiveTask = function(request, callback){

  let userId = request.userId;
  let taskId = request.taskId;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    user.options.activeTasks.id(taskId).remove();
    user.save(callback);
  });

};
