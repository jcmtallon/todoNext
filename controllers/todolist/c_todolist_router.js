/*jshint esversion: 6 */

//Used to be able to extract the data from the post req.
const bodyParser = require('body-parser');

//Used to interact with the database.
const mongoose = require('mongoose');

//Connect to the database
mongoose.connect('mongodb://tallyTS:pro040703thy@ds259253.mlab.com:59253/todonextdb', { useNewUrlParser: true });

//create db schema = like a blueprint for our data
//this schema cannot be a constant
let todoSchema = new mongoose.Schema({
  item: String
});

//'Tasks' is the name of the collection.
let Todo = mongoose.model('Tasks',todoSchema);

//db object example
// let itemOne = Todo({item: 'get flowers'}).save(function(err){
//   if(err) throw err;
//   console.log('item saved');
// });

//dummy data
//let data = [{item:'get milk'},{item:'walk dfasdfas'},{item:'kick'}];



var urlencodedParser = bodyParser.urlencoded({extended: false});


module.exports = function(app){

  //renders the main view
  app.get('/', function(req, res){
    //get data from mongodb and pass it to view. Empty objects retrieve everything. Else {item: 'flowers'}
    Todo.find({}, function(err, data){
      if(err) throw err;
      res.render('main_view', {todos:data});
    });
  });


  app.post('/', urlencodedParser, function(req, res){
    //get data from the view and add it to mongodb
    let newTodo = Todo(req.body).save(function(err,data){
      if (err) throw err;
      res.json(data);
    });
  });

  app.post('/remove', urlencodedParser, function(req, res){
    console.log(req.body);
    res.json("test");
  });
};


//delete from mongodb.
// Todo.find({item: 'xxxx'}).remove(function(err,data){
//   if(err) throw err;
//   res.json(data);
// });
