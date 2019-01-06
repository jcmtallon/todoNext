/*jshint esversion: 6 */
const EventEmitter = require('events');


/**
 *  Creates the query that will be sent to the db in order to
 *  add new tasks.
 */
 module.exports = class NewTaskModel extends EventEmitter{
   constructor(){
     super();
     this._type = 'task';
     this._name = '';
     this._dueTo = '';
     this._frequency = 0;
     this._category = '';
     this._categoryId = '';
     this._isNewCategory = false;
     this._project = '';
     this._projectId = '';
     this._isNewProject = false;
     this._hours = 'Fast task';
     this._urgency = 'Normal';
     this._learning = false;
     this._user = 'tally';
     this._status = 'active';
     this._progress = 0;
     this._habitId = "";
     this._nextTaskDate = "";
   }

   get progress(){
     return this._progress;
   }


   get type(){
     return this._type;
   }

   set type(type) {
    this._type = type;
    this.emit('typeSaved');
  }

   set name(name){
    this._name = name;
   }

   get name(){
     return this._name;
   }

   set dueTo(date){
      this._dueTo = date;
      this.emit('dateSaved',this);
   }

   get frequency(){
     return this._frequency;
   }

   set frequency(frequency){
     this._frequency = Number(frequency);
     this.emit('dateSaved',this);
   }

   get dueTo(){
     return this._dueTo;
   }

   set category(categoryPackage){
     this._category = categoryPackage.categoryName;
     this._isNewCategory = categoryPackage.isNew;
     this.emit('categorySaved');
   }

   get category(){
     return this._category;
   }

   set project(projectPackage){
     this._project = projectPackage.projectName;
     this._isNewProject = projectPackage.isNew;
     this.emit('projectSaved');
   }

   get project(){
     return this._project;
   }

   set hours(option){
     this._hours = option;
     this.emit('hoursSaved');
   }

   get hours(){
     return this._hours;
   }

   get urgency(){
     return this._urgency;
   }

   set urgency(option){
     this._urgency = option;
     this.emit('urgencySaved');
   }

   get learning(){
     return this._learning;
   }

   set learning(option) {
    this._learning = option;
    this.emit('learningSaved');
  }

   get user(){
     return this._user;
   }

   get status(){
     return this._status;
   }

   get projectId(){
      return this._projectId;
   }

   set projectId(id){
     this._projectId = id;
   }

   get categoryId(){
     return this._categoryId;
   }

   set categoryId(id){
     this._categoryId=id;
   }

   get habitId(){
     return this._habitId;
   }

   set habitId(id){
     this._habitId=id;
   }

   get nextTaskDate(){
     return this._nextTaskDate;
   }

   set nextTaskDate(date){
     this._nextTaskDate=date;
   }


 };
