/*jshint esversion: 6 */
const appConfig = require('./../appConfig/appConfig');

const mongoose = require('mongoose');

// this schema cannot be a constant
let pointSchema = new mongoose.Schema({
  points: Number,
  taskId: String,
  categoryId: String,
  projectId: String,
  date: Date,
  user: String
});

let targetCollection = (appConfig.production) ? 'prodPoints' : 'Points';

let Point = module.exports = mongoose.model(targetCollection, pointSchema);


// Inserts an array of tasks.
module.exports.savePoints = function(request, callback){
  Point.insertMany(request, callback);
};

// Removes a single point from db.
module.exports.deleteOnePoint = function(request, callback){
  Point.deleteOne(request, callback);
};
