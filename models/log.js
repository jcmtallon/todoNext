const appConfig = require('./../appConfig/appConfig');
const mongoose = require('mongoose');

// Quick solution for keeking logs during the initial phase of the release.
// TODO: study and put together a proper logging system. This one is disgraceful.
let logSchema = new mongoose.Schema({
  log: String,
  date: Date
});

// Saves logs into different collections depending on the current environment
let targetCollection = (appConfig.production) ? 'prodLogs' : 'Logs';

let Log = module.exports = mongoose.model(targetCollection, logSchema);


// Adds new logs to db.
module.exports.saveLog = function(request, callback){
  Log.insertMany(request, callback);
};
