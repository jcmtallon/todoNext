/*jshint esversion: 6 */
const appConfig = require('./../appConfig/appConfig');
const mongoose = require('mongoose');

// this schema cannot be a constant
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

let targetCollection = (appConfig.production) ? 'prodProjects' : 'Projects';

let Project = module.exports = mongoose.model(targetCollection, projectSchema);



// Inserts an array of tasks.
module.exports.saveProjects = function(request, callback){
  Project.insertMany(request, callback);
};



// Removes a single point from db.
module.exports.deleteOneProject = function(request, callback){
  Project.deleteOne(request, callback);
};



// Finds all tasks that match with the conditions passed by the request.
module.exports.findProjects = function(request, res, next){

  let id = request.userId;
  let size = Number(request.size);
  let page = (request.pageNb!=undefined) ? request.pageNb : 1;
  let skip = (page - 1) * size;

  Project.countDocuments({userId: id},function(err,totalCount) {
     if(err) {
       response = {"error" : true, "message" : "Error counting number of projects"};
     } else {
       Project.find({userId: id})
              .sort({completedBy:-1})
              .skip(skip)
              .limit(size)
              .exec(function(err, projects){

         if(err) return next(err);
         let totalPages = Math.ceil(totalCount / size);
         response = {"error" : false, "projects" : projects, "pages": totalPages};
         res.send(response);

       });
     }

  });
};
