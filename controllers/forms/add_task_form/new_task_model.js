/*jshint esversion: 6 */
const EventEmitter = require('events');

/**
 * Stores the new task attributes and observes about changes.
 */

 module.exports = class NewTaskModel extends EventEmitter{
   constructor(){
     super();
     this._type = 'task';
     this._name = '';
     this._dueTo = new Date();
     this._frequency = 0;
     this._category = 'other';
     this._isNewCategory = false;
     this._project = '';
     this._isNewProject = false;
     this._hours = 'Fast task';
     this._urgency = 'Normal';
     this._learning = false;
     this._user = '';
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
      this.emit('dateSaved');
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
 };
