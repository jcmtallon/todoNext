/*jshint esversion: 6 */

// Used to read war files.
const fs = require('fs');

// Used to extract data from post requests.
const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended: false});

// Used to interact with the database.
const mongoose = require('mongoose');

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

// Set connection to database.
// userNewUrlParser is necessary to prevent mongodb warnings.
mongoose.connect('mongodb://tallyTS:pro040703thy@ds259253.mlab.com:59253/todonextdb', {
  useNewUrlParser: true,
});


// create db schema (like a blueprint for our data)
// this schema cannot be a constant
let todoSchema = new mongoose.Schema({
  type: String,
  name: String,
  dueTo: Date,
  frequency: Number,
  category: String,
  project: String,
  hours: String,
  urgency: String,
  learning: Boolean,
  user: String,
  status: String,
  categoryId: String,
  projectId: String,
  progress: Number,
  habitId: String,
  nextTaskDate: Date
});

//'Tasks' is the name of the collection.
let Todo = mongoose.model('Tasks',todoSchema);


module.exports = function(app){

  //Renders the main view
  app.get('/', function(req, res){
      res.render('main_view');
  });


  // Gets all active todos.
  app.get('/getTodos', urlencodedParser, function(req, res, next){
    Todo.find(req.query, function(err, data){
      if(err) return next(err);
      res.send(data);
    });
  });


  // Adds a new item to the database.
  app.post('/addTodo', urlencodedParser, function(req, res, next){
    let newTodo = Todo(req.body).save(function(err,data){
      if (err) return next(err);
      res.json(data);
    });
  });


  // Adds multiple tasks at the same time to the db.
  app.post('/addTodos', urlencodedParser, function(req, res, next){
    let tasks = JSON.parse(req.body.tasks);
    Todo.insertMany(tasks, function(err, data){
      if (err) return next(err);
      res.json(data);
    });
  });


  // Reads read file data.
  app.post('/readWar', urlencodedParser, function(req, res){
    let rawData = fs.readFileSync('./files/' + req.body.userName + '/config.json');
    let config = JSON.parse(rawData);
    res.send(config);
  });


  // Writes data back into res file.
  app.post('/writeWar', urlencodedParser, function(req,res){
    fs.writeFile('./files/' + req.body.userName + '/config.json', req.body.data, function(){
      res.send("done");
    });
  });





  // Updates the next task date of an existing habit.
  app.post('/updateHabitDate', urlencodedParser, function(req, res, next){

    Todo.findById(req.body.id, function (err, todo) {
      if (err) return next(err);
      todo.nextTaskDate = req.body.nextTaskDate;
      todo.save(function (err, updatedTodo) {
        if (err) return next(err);
        res.send();
      });
    });

  });


  // Receives an object with an id and an update property that contains all the
  // properties that need to be updated, updates the target db item with the new
  // data and returns the updated item.
  app.post('/updateTodo', urlencodedParser, function(req, res, next){

    Todo.findOneAndUpdate({"_id": req.body.id},
                          JSON.parse(req.body.update),
                          {new: true},
                          function (err, updatedTodo){
      if (err) return next(err);
      console.log(updatedTodo);
      res.send(updatedTodo);
    });

  });

};
