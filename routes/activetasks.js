/*jshint esversion: 6 */
const User = require('./../models/user');

// Used to extract data from post requests.
const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){

  // Receives an user id and a task id, finds the corresponding
  // active task in the activetask array of the user option object
  // and removes the task from the array.
  app.delete('/activetasks', urlencodedParser, function(req, res, next){

  User.removeActiveTask(req.body, function(err, options){
    if (err) return next(err);
    res.send(options);
    });
  });


};
