const appConfig = require('./../appConfig/appConfig');

const mongoose = require('mongoose');

// this schema cannot be a constant
let sessionSchema = new mongoose.Schema({
  socketId: String,
  userId: String
});

let targetCollection = (appConfig.production) ? 'prodSessions' : 'Sessions';

let Session = module.exports = mongoose.model(targetCollection, sessionSchema);

// Finds session by userId.
module.exports.getSessionByUserId = function(userId, callback){
  let query = {userId: userId};
  Session.findOne(query, callback);
};

// Adds new sessions
module.exports.saveSession = function(request, callback){
  Session.insertMany(request, callback);
};

// Removes a single session.
module.exports.deleteOneProject = function(request, callback){
  Session.deleteOne(request, callback);
};

// Updates target session with passed modifications.
module.exports.patchById = function(id, request, callback){
  Session.findById(id, function (err, session) {
    if (err) return next(err);

    if(session){

      for (let k in request){
        if (request.hasOwnProperty(k)) {
          session[k] = request[k];
        }
      }
      session.save(callback);

    }
  });

};
