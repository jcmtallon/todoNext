const appConfig = require('./../appConfig/appConfig');
const mongoose = require('mongoose');


// Projects are entities that users can use to group tasks
// into an specific general goal.
// The same as tasks, projects can be active projects or completed projects.
// Active projects are saved directly into the User Option object to improve
// front end performance. Once a project is marked as complete by the user, such
// project is saved as an individual item inside the complete project collection
// in the database. Completed projects can be restored as active projects anytime
// by the users from the Complete projects page.
let projectSchema = new mongoose.Schema({
  title: String,
  categoryId: String,
  deadline: Date,
  description: String,
  isLearning: Boolean,
  completedTaskNb: Number,
  totalTaskNb: Number,
  userId: String,
  completedBy: Date
});

// Saves complete projects into different collections depending on the environment.
let targetCollection = (appConfig.production) ? 'prodProjects' : 'Projects';

let Project = module.exports = mongoose.model(targetCollection, projectSchema);



// Saves multiple projects
module.exports.saveProjects = function(request, callback){
  Project.insertMany(request, callback);
};



// Removes a single project.
module.exports.deleteOneProject = function(request, callback){
  Project.deleteOne(request, callback);
};




// Fetches all matching projects
// Returns total count data that the frontend can use for
// pagination calculations. 
module.exports.findProjects = function(request, res, next){

  let id = request.userId;
  let select = (request.hasOwnProperty('select')) ? request.select : '';
  let size = (request.hasOwnProperty('size')) ? Number(request.size) : '';

  let page = (request.hasOwnProperty('pageNb')) ? (request.pageNb!=undefined) ? request.pageNb : 1 : '';
  let skip = (page != '') ? (page - 1) * size : '';

  Project.countDocuments({userId: id},function(err,totalCount) {
     if(err) {
       response = {"error" : true, "message" : "Error counting number of projects"};
     } else {
       Project.find({userId: id})
              .sort({completedBy:-1})
              .skip(skip)
              .limit(size)
              .select(select)
              .exec(function(err, projects){

         if(err) return next(err);
         let totalPages = Math.ceil(totalCount / size);
         response = {"error" : false, "projects" : projects, "pages": totalPages};
         res.send(response);
       });
     }
  });
};
