/*jshint esversion: 6 */

//Used to extract data from post requests.
const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended: false});

//Used to interact with the database.
const mongoose = require('mongoose');

//Set connection to database.
//userNewUrlParser is necessary to prevent mongodb warnings.
mongoose.connect('mongodb://tallyTS:pro040703thy@ds259253.mlab.com:59253/todonextdb', { useNewUrlParser: true });


//create db schema (like a blueprint for our data)
//this schema cannot be a constant
let todoSchema = new mongoose.Schema({
  item: String
});

//'Tasks' is the name of the collection.
let Todo = mongoose.model('Tasks',todoSchema);


module.exports = function(app){

  //Renders the main view
  app.get('/', function(req, res){
    Todo.find({}, function(err, data){
      if(err) throw err;
      res.render('main_view', {todos:data});
    });
  });

  //Adds new items to the database.
  app.post('/', urlencodedParser, function(req, res){
    let newTodo = Todo(req.body).save(function(err,data){
      if (err) throw err;
      res.json(data);
    });
  });

  //Does nothing so far
  app.post('/remove', urlencodedParser, function(req, res){
    console.log(req.body);
    res.json("test");
  });
};
