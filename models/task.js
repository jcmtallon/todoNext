/*jshint esversion: 6 */
const appConfig = require('./../appConfig/appConfig');

const mongoose = require('mongoose');

// this schema cannot be a constant
let taskSchema = new mongoose.Schema({
  title: String,
  dueTo: Date,
  urgency: String,
  hours: String,
  progress: Number,
  isLearning: Boolean,
  status: String,
  categoryId: String,
  projectId: String,
  habitId: String,
  notes: String,
  userId: String
});

let targetCollection = (appConfig.production) ? 'prodTasks' : 'Tasks';

let Task = module.exports = mongoose.model(targetCollection,taskSchema);

// Finds all tasks that match with the conditions passed by the request.
module.exports.findTasks = function(request, callback){
  Task.find(request, callback);
};


// Inserts an array of tasks.
module.exports.saveTasks = function(request, callback){
  Task.insertMany(request, callback);
};


// Updates target task with passed modifications.
module.exports.patchById = function(id, request, callback){

  Task.findById(id, function (err, task) {
    if (err) return next(err);

    for (let k in request){
      if (request.hasOwnProperty(k)) {
        task[k] = request[k];
      }
    }

    task.save(callback);
  });

};
