/*jshint esversion: 6 */
const appConfig = require('./../appConfig/appConfig');

const mongoose = require('mongoose');

// this schema cannot be a constant
let pointSchema = new mongoose.Schema({
  points: Number,
  taskId: String,
  categoryId: String,
  projectId: String,
  habitId: String,
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


// Finds all tasks that match with the conditions passed by the request.
module.exports.findPoints = function(request, res, next){

  let id = request.userId;

  Point.find({user: id, date: {$gt: request.from, $lt: request.until}})
         .exec(function(err, points){

    if(err) return next(err);
    response = {"error" : false, "points" : points};
    res.send(response);

  });
};
