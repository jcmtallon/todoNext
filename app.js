/*jshint esversion: 6 */
const express = require('express');
const todolistController = require('./controllers/routers/c_todolist_router');

const app = express();

//set up template engine
app.set('view engine', 'ejs');

//static files
app.use(express.static('./public'));

//fire controllers
todolistController(app);

//Error handling middleware
app.use(function(err,req,res,next){
  console.log(err.message);
  res.status(422).send({error:err.message});
});

//listen to port
let port = process.env.PORT;
if(port == null || port == ""){
  port = 8000;
}
app.listen(port);
console.log("Listening to port 3000.");
