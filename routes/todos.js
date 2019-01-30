/*jshint esversion: 6 */
const Todo = require('./../models/todo');

// Used to extract data from post requests.
const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended: false});


module.exports = function(app){

  // Gets all active todos.
  app.get('/todos', urlencodedParser, function(req, res, next){

    Todo.findTodos(req.query, function(err, todos){
      if(err) return next(err);
      res.send(todos);
    });
  });


  // Adds array of todos into database.
  app.post('/todos', urlencodedParser, function(req, res, next){

    let todos = JSON.parse(req.body.todos);

    Todo.saveTodos(todos, function(err, savedTodos){
      if (err) return next(err);
      res.json(savedTodos);
    });
  });

  

  // Updates target todo with passed modifications.
  app.patch('/todos', urlencodedParser, function(req, res, next){

    let request = JSON.parse(req.body.request);

    Todo.patchById(req.body.id, request, function(err, updatedTodo){
      if (err) return next(err);
      res.send(updatedTodo);
    });
  });

};
