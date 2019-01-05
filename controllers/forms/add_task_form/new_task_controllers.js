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

     // Get corresponding value from options object.
     let hourModel = this._options.hours.find( obj => {
       return obj.title == option;});

     this._model.hours = hourModel.value;
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
       if(this._model.project!=''){
         let projectModel = this._options.projects.find( obj => {
           return obj.title == this._model.project;});
           projectName = (categoryName != projectModel.category) ? '' : this._model.project;
       }else{
         projectName = '';
       }
     }

     let projectPackage = {projectName: projectName, isNew: false};
     this._model.project = projectPackage;


     // Finally retrieve category and project ID from options and
     // save them into the model (if there are ids)
     if(categoryName!='' && isNew==false){
       let catId = this._options.categories.find(obj => {
         return obj.title == categoryName;});
        this._model.categoryId= catId.id;
     }else if(categoryName=='' && isNew==false){
       this._model.categoryId = '';
     }

     if(projectName!='' && isNew==false){
       let proId = this._options.projects.find(obj => {
         return obj.title == projectName;});
       this._model.projectId= proId.id;
     }else if(projectName=='' && isNew==false){
       this._model.projectId= '';
     }

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

       // Retrieve category ID from options and
       // save it into the model.
       if(categoryName!='' && isNew==false){
         let catId = this._options.categories.find(obj => {
           return obj.title == categoryName;});
          this._model.categoryId= catId.id;
       }else if(categoryName=='' && isNew==false){
         this._model.categoryId= '';
       }

     }

     // Retrieve project ID from options and
     // save it into the model (if there is)
     if(projectName!='' && isNew==false){
       let proId = this._options.projects.find(obj => {
         return obj.title == projectName;});
        this._model.projectId= proId.id;
     }else if(projectName=='' && isNew==false){
       this._model.projectId= '';
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

     let messenger = new MsgBox();

     // Abort if no internet connection.
     if(!navigator.onLine){
       messenger.showMsgBox('Failed to add item. \nCheck if there is an internet connection.','error','down');
       return;
     }


     // If no task/habit name, abort submit.
     if(name==''){
       messenger.showMsgBox('You have to insert a task or habit first.','error','up');
       return;
     }

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
         messenger.showMsgBox('Insert a valid date or a exact number of days.','error','up');
       }


     // Went it is a habit.
     }else{

       if(!isNaN(date) && date<365 && date>0){
         this._model.frequency = date;
       }else{
         messenger.showMsgBox('Insert a exact number of days.','error','up');
       }

     }


   }

 };

 function isValidDate(date) {
   return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
 }
