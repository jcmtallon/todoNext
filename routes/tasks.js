const Task = require('./../models/task');

const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){

  // Gets all matching tasks.
  app.get('/tasks', urlencodedParser, function(req, res, next){
    Task.findTasks(req.query, res, next);
  });

  // Adds array of tasks to db.
  app.post('/tasks', urlencodedParser, function(req, res, next){

    let tasks = JSON.parse(req.body.tasks);

    Task.saveTasks(tasks, function(err, savedTasks){
      if (err) return next(err);
      res.json(savedTasks);
    });
  });

  // Updates target task with passed modifications.
  app.patch('/tasks', urlencodedParser, function(req, res, next){

    let request = JSON.parse(req.body.request);

    Task.patchById(req.body.id, request, function(err, updatedTask){
      if (err) return next(err);
      res.send(updatedTask);
    });
  });

  // Removes a single project from db.
  app.delete('/tasks', urlencodedParser, function(req, res, next){
    Task.deleteTaskById(req.body, function(err, removedTask){
      if(err) return next(err);
      res.json(removedTask);
    });
  });

};
