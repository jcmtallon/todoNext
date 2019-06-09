/*jshint esversion: 6 */
const Task = require('./../models/task');

// Used to extract data from post requests.
const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended: false});


module.exports = function(app){

  // Gets all active todos.
  app.get('/tasks', urlencodedParser, function(req, res, next){

    Task.findTasks(req.query, function(err, tasks){
      if(err) return next(err);
      res.send(tasks);
    });
  });


  // Adds array of todos into database.
  app.post('/tasks', urlencodedParser, function(req, res, next){

    let tasks = JSON.parse(req.body.tasks);

    Task.saveTasks(tasks, function(err, savedTasks){
      if (err) return next(err);
      res.json(savedTasks);
    });
  });



  // Updates target todo with passed modifications.
  app.patch('/tasks', urlencodedParser, function(req, res, next){

    let request = JSON.parse(req.body.request);

    Task.patchById(req.body.id, request, function(err, updatedTask){
      if (err) return next(err);
      res.send(updatedTask);
    });
  });

};
