const Project = require('./../models/project');

const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){

  //Gets projects by query. 
  app.get('/projects', urlencodedParser, function(req, res, next){
    Project.findProjects(req.query, res, next);
  });


  app.post('/projects', urlencodedParser, function(req, res, next){

    let projects = JSON.parse(req.body.projects);

    Project.saveProjects(projects, function(err, savedProjects){
      if (err) return next(err);
      res.json(savedProjects);
    });
  });

  // Removes a single project from db.
  app.delete('/projects', urlencodedParser, function(req, res, next){
    Project.deleteOneProject(req.body, function(err, removedProject){
      if(err) return next(err);
      res.json(removedProject);
    });
  });

};
