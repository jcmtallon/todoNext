const appConfig = require('./../appConfig/appConfig');
const mongoose = require('mongoose');

// When a user starts a new session, the session information is saved right away
// into a db collection. At the same time, the backend checks if any other active session
// currently exists in the database for that user. If such session exists, it is instantly
// terminated using socket io to prevent that a user can have more than one session with the
// same account opened at the same time.
let sessionSchema = new mongoose.Schema({
  socketId: String,
  userId: String
});

// Saves session into a different db collection depending on the current environment.
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
