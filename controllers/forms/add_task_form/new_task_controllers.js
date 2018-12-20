/*jshint esversion: 6 */
const EventEmitter = require('events');
const MsgBox = require('./../../messageBox/messageBox');

/**
* Controller responds to user actions and
* invokes changes on the model.
 */

 module.exports = class NewTaskController extends EventEmitter{
   constructor(model, view, options){
     super();
     this._model = model;
     this._view = view;
     this._options = options;

     view.on('saveType', type => this.saveType(type));
     view.on('saveLearning', option => this.saveLearning(option));
     view.on('saveUrgency', option => this.saveUrgency(option));
     view.on('saveHours', option => this.saveHours(option));
     view.on('saveCategory', (option, input) => this.saveCategory(option, input));
     view.on('saveProject', (option, input) => this.saveProject(option, input));
     view.on('saveNameDate', (name, date) => this.saveNameDate(name, date));
   }

   saveType(type){
     this._model.type = type;
   }

   saveLearning(option){
     let result = (option == 'Also a learning') ? true : false;
     this._model.learning = result;
   }

   saveUrgency(option){
     this._model.urgency = option;
   }

   saveHours(option){
     this._model.hours = option;
   }

   saveCategory(option, input){

     let isNew = false;
     let categoryName = option;

     // If new category, change isNew to True.
     if (option == 'Add new'){
       isNew = true;
       categoryName = input;
     }

     let categoryPackage = {categoryName: categoryName, isNew:isNew};
     this._model.category = categoryPackage;

     //If project is not compatible with this category, remove project.
     let projectName;

     if (isNew){
        projectName = '';
     }else if (categoryName == ''){
        projectName = '';
     }else{
       let projectModel = this._options.projects.find( obj => {
         return obj.category == categoryName;});
       projectName = (this._model.project != projectModel.title) ? '' : this._model.project;
     }

     let projectPackage = {projectName: projectName, isNew: false};
     this._model.project = projectPackage;

   }

   saveProject(option, input){

     let isNew = false;
     let projectName = option;

     if (option == 'Add new'){
       isNew = true;
       projectName = input;
     }

     let projectPackage = {projectName: projectName, isNew:isNew};
     this._model.project = projectPackage;

     //If project is not compatible with this category, change category corresponding.
     let categoryName;

     if (projectName!=''){

       if (isNew){
         categoryName='';
       }else{
         let projectModel = this._options.projects.find( obj => {
           return obj.title == projectName;});
         categoryName = projectModel.category;
       }

       let categoryPackage = {categoryName: categoryName, isNew: false};
       this._model.category = categoryPackage;

     }
   }


   /**
    * saveNameDate - Saves name and validates input date.
    * For tasks, it also accepts numbers from 1 to 355. Numbers are
    * automatically transformed into dates (summed to the current date).
    * For habits, it only accepts numbers and not dates.
    *
    * @param  {string} name description
    * @param  {string} date
    */
   saveNameDate(name, date){

     this._model.name = name;

     if (this._model.type == 'task'){

       // We initially assume that the input date will be correct.
       let sendDate = true;

       // We save input into a date class and extracts its year for later validation.
       let inputDate = new Date(date);
       let inputYear = inputDate.getYear();

       // Variable sent at the very end of this method to the model.
       let finalDate= new Date();

       // For date validation purposes.
       let thisYear = finalDate.getYear();
       let nextYear = thisYear + 1;

       switch (true) {

         case (isValidDate(inputDate) && (inputYear>=thisYear && inputYear<=nextYear)):
           finalDate = inputDate;
           break;

         case date == 'Today':
           break;

         case date == 'TMR':
           finalDate.setDate(finalDate.getDate()+1);
           break;

         case date == 'DAT':
           finalDate.setDate(finalDate.getDate()+2);
           break;

         case date == '1 week':
           finalDate.setDate(finalDate.getDate()+7);
           break;

         case date == '2 weeks':
           finalDate.setDate(finalDate.getDate()+14);
           break;

         case date == '1 month':
           finalDate.setDate(finalDate.getDate()+30);
           break;

         case !isNaN(date) && date<365 && date>0:
           finalDate.setDate(finalDate.getDate() + Number(date));
           break;

         default:
         sendDate = false;

       }

       if(sendDate){
         this._model.dueTo = finalDate;
       }else {
         let messenger = new MsgBox();
         messenger.showMsgBox('Insert a valid date or a exact number of days.','error','up');
       }

     }else{

     }


   }

 };

 function isValidDate(date) {
   return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
 }
