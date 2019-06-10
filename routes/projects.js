  /*jshint esversion: 6 */
const Project = require('./../models/project');

// Used to extract data from post requests.
const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended: false});


module.exports = function(app){

  // Gets all active tasks.
  app.get('/projects', urlencodedParser, function(req, res, next){
    Project.findProjects(req.query, res, next);
  });

  // Adds array of tasks into database.
  app.post('/projects', urlencodedParser, function(req, res, next){

    let projects = JSON.parse(req.body.projects);

    Project.saveProjects(projects, function(err, savedProjects){
      if (err) return next(err);
      res.json(savedProjects);
    });
  });

  // Removes a single point from db.
  app.delete('/projects', urlencodedParser, function(req, res, next){
    Project.deleteOneProject(req.body, function(err, removedProject){
      if(err) return next(err);
      res.json(removedProject);
    });
  });

};
