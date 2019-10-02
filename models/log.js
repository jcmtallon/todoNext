const appConfig = require('./../appConfig/appConfig');

const mongoose = require('mongoose');

// this schema cannot be a constant
let logSchema = new mongoose.Schema({
  log: String,
  date: Date
});

let targetCollection = (appConfig.production) ? 'prodLogs' : 'Logs';

let Log = module.exports = mongoose.model(targetCollection, logSchema);

// Adds new log
module.exports.saveLog = function(request, callback){
  Log.insertMany(request, callback);
};
