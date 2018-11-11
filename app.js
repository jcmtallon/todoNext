/*jshint esversion: 6 */
const express = require('express');
const todolistController = require('./controllers/todolist/c_todolist_router');

const app = express();

//set up template engine
app.set('view engine', 'ejs');

//static files
app.use(express.static('./public'));

//fire controllers
todolistController(app);

//listen to port
let port = process.env.PORT;
if(port == null || port == ""){
  port = 8000;
}
app.listen(port);
console.log("Listening to port 3000.");
