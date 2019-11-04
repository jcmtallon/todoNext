const appConfig = require('./../appConfig/appConfig');
const mongoose = require('mongoose');


// Complete task schema.
// While active tasks are directly saved into the User Option object to improve the frontend
// speed, once a task has been completed it is remove from the user option object and saved
// into the db complete task collection instead. Users can restore completed tasks into
// active tasks at any moment they want from the Completed task page.
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
  userId: String,
  instantId: String
});

// Saves tasks in different db collections depending on the current environment.
let targetCollection = (appConfig.production) ? 'prodTasks' : 'Tasks';

let Task = module.exports = mongoose.model(targetCollection, taskSchema);


// Fetches all matching tasks
// Returns total count number for pagination button calculations.
module.exports.findTasks = function(request, res, next){

let size = Number(request.size);
let skip = Number(request.skip);

req = {userId: request.userId};

if (request.hasOwnProperty('status')) req.status = request.status;
if (request.hasOwnProperty('categoryId')) req.categoryId = request.categoryId;
if (request.hasOwnProperty('projectId') && request.projectId != '') req.projectId = request.projectId;
if (request.hasOwnProperty('habitId') && request.habitId != '') req.habitId = request.habitId;

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


// Posts multiple tasks
module.exports.saveTasks = function(request, callback){
  Task.insertMany(request, callback);
};


//Patches specified task.
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


// Removes single task from db.
module.exports.deleteTaskById = function(request, callback){
  Task.deleteOne(request, callback);
};
