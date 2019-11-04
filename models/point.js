const appConfig = require('./../appConfig/appConfig');
const mongoose = require('mongoose');

// Every time a user completes a task or makes some progress in it, the user
// receives points that later can be used to measure the user performance via
// the stats panel.
let pointSchema = new mongoose.Schema({
  points: Number,
  taskId: String,
  categoryId: String,
  projectId: String,
  habitId: String,
  date: Date,
  user: String
});

// Saves points into different collections depending on the current environment.
let targetCollection = (appConfig.production) ? 'prodPoints' : 'Points';

let Point = module.exports = mongoose.model(targetCollection, pointSchema);


// Adds multiple points.
module.exports.savePoints = function(request, callback){
  Point.insertMany(request, callback);
};


// Removes  single point from db.
module.exports.deleteOnePoint = function(request, callback){
  Point.deleteOne(request, callback);
};


// Fetches matching points
module.exports.findPoints = function(request, res, next){
  let id = request.userId;
  Point.find({user: id, date: {$gt: request.from, $lt: request.until}})
         .exec(function(err, points){

    if(err) return next(err);
    response = {"error" : false, "points" : points};
    res.send(response);
  });
};
