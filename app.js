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
app.listen(3000);
console.log("Listening to port 3000.");
