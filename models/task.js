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

let Task = module.exports = mongoose.model(targetCollection, taskSchema);

// Finds all tasks that match with the conditions passed by the request.
module.exports.findTasks = function(request, res, next){

let size = Number(request.size);
let skip = Number(request.skip);

req = {userId: request.userId};

if (request.hasOwnProperty('status') && request.status != '') req.status = request.status;
if (request.hasOwnProperty('categoryId') && request.categoryId != '') req.categoryId = request.categoryId;
if (request.hasOwnProperty('projectId') && request.projectId != '') req.projectId = request.projectId;

console.log(size);

Task.countDocuments(req, function(err, totalCount) {
  if(err){
    response = {"error": true, "message": "Error counting number of tasks."};
  }else{
    if(size>0){
      Task.find(req)
      .sort({dueTo:-1})
      .skip(skip)
      .limit(size)
      .exec(function(err, tasks){

        if(err) return next(err);
        response = {"error" : false, "tasks" : tasks, "totalCount": totalCount};
        res.send(response);
        });

      // If size was 0, send and empty array instead.
      }else{
        response = {"error" : false, "tasks" : [], "totalCount": totalCount};
        res.send(response);
      }
    }
  });
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
