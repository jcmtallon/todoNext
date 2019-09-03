const OPTIONS = require('./../optionHandler/OptionHandler');
const FilteredTaskListView = require('./filteredTaskListView');
const ProgressForm = require('./../activeTodos/progressForm');
const NoteEditorForm = require('./../activeTodos/notesForm');
const FilteredTaskForm = require('./FilteredTaskForm');
const QuickStatForm = require('./../quickStats/QuickStatForm');
const EditActiveTaskForm = require('./../activeTodos/activeTaskEditForm');
const MsgBox = require('./../messageBox/messageBox');
const Page = require('./../pages/page');
const flashMsg = require('./../messageBox/flashMsg');
const loader = require('./../otherMethods/Loader');
const utils = require('./../utilities/utils');
const moment = require('moment');

let _messanger;

/**
 * Page where users can filter the type of task they want to display.
 * Tasks can be filtered by status ('active', 'pending', 'complete'),
 * and also by habit id, category id and project id.
 * This list is made by combining the task data from the local active task array
 * and queried data from the database task collection.
 */
 class FilteredTaskPage extends Page{
   constructor(){
   super();

   _messanger = new MsgBox();

   // Page id
   this.pageName = 'FilteredTasks';

   // Top bar buttons
   this.filtersBtn = {
     id: 'topBar_taskFilter_btn',
     text: 'Filters',
     action: async () => {
       let projects = await OPTIONS.projects.getProjectOptions();
       let form = new FilteredTaskForm((renderQ, searchQ)=>this.show(renderQ, searchQ), projects);
       form.displayForm();
     }
   };

   this.quickStatsBtn = {
     id: '',
     text:'Quick stats',
     action: function(){
         let form = new QuickStatForm();
         form.show();
       }
   };

   this._topBarBtns = [this.filtersBtn, this.quickStatsBtn];

   // Page title
   this._pageTitle = 'Tasks';

   // Methods
   this.actions = {
     refreshPage: (pageNb) => {this._showPage(pageNb);},
     openProgressEditor: (instantId) => {this._showProgressForm(instantId);},
     openNoteEditor : (instantId) => {this._showNoteForm(instantId);},
     editItem: (instantId) => {this._showEditTaskForm(instantId);},
     toggleActiveStatus: (instantId) => {this._toggleActiveStatus(instantId);},
     setAsPending : (instantId) => {this._setItemAsPending(instantId);},
     setAsComplete : (instantId) => {this._setItemAsComplete(instantId);},
     removeItem: (instantId) => {this._removeItem(instantId);},
     setAsActive: (instantId) => {this._setItemAsActive(instantId);}
    };
   }




   /**
    * Displays task filter page with the tasks specified by the received
    * search query and with the display effects specified by the renderQuery
    * object.
    * @param  {Object} renderQuery = undefined , E.g. {fadeIn: true, scrollToTop: true};
    * @param  {type} searchQuery = undefined  E.g. {pageNb: 1, status: 'pending'}
    */
   async show(renderQuery = undefined, searchQuery = undefined){

     // Save reference to query (used when loading other pages)
     this.searchQuery = searchQuery;

     this.updateLocalStorage();

     this.listView = new FilteredTaskListView(this.actions, this);
     this.taskList = await this.listView.getList(searchQuery, renderQuery);
     this.pageBtns = this.listView.getPagingBtns(this.listView.pageCnt, searchQuery.pageNb, this.actions.refreshPage);
     this.filterTags = this.listView.getFilterTagRow(searchQuery);

     // Don't do anything if a different page is active.
     if(!this._pageIsOpen(this)) return;

     // Resets and clears page container
     this.setPage();

     // Scrolls when necessary
     this._scrollPage(renderQuery);

     // Remember page number
     this.currentPage = (searchQuery!=undefined) ? searchQuery.pageNb : 1;

     // Insert contents
     this._Editor.insertContents(this.filterTags);
     this._Editor.insertContents(this.taskList);
     this._Editor.insertContents(this.pageBtns);

     // Applies fadeIn effect when necessary
     this._fadeIn(renderQuery);

     // Applies highlight and scroll effect to specified item when necessary
     this._hightlightItem(renderQuery);

     // Display msg
     this._displayMsg(renderQuery);
   }


   /**
    * Updates a local option task with the passed task object data.
    * @param  {Task} task
    */
   updateTask(task){
     this._updateTask(task);
   }





   //-------------------- Page methods ------------------------------//


   /**
    * Shows specified page directly from the top
    * and without any fade in effect.
    */
   _showPage(pageNb){
      this.searchQuery.pageNb = pageNb;
      let renderQuery = {fadeIn: false, scrollToTop: true};
      this.show(renderQuery, this.searchQuery);
   }

   /**
    * Refresh page data reflecting changes applied only to active tasks
    * without having to reload the data for the pending and complete
    * tasks.
    * Method used to prevent having to send a search query to the database
    * every time a user updates the data for an active task contained
    * in the local options.
    */
   _refresh(renderQuery = undefined){

      this.updateLocalStorage();

      this.listAssets = this.listView.getListAssets();

      this.listView = new FilteredTaskListView(this.actions, this);
      this.taskList = this.listView.refreshView(this.listAssets, this.searchQuery);
      this.pageBtns = this.listView.getPagingBtns(this.listView.pageCnt, this.searchQuery.pageNb, this.actions.refreshPage);

      // Don't do anything if a different page is active.
      if(!this._pageIsOpen(this)) return;

      // Resets and clears page container
      this.setPage();

      // Scrolls when necessary
      this._scrollPage(renderQuery);

      // Remember page number
      this.currentPage = (this.searchQuery!=undefined) ? this.searchQuery.pageNb : 1;

      // Insert contents
      this._Editor.insertContents(this.taskList);
      this._Editor.insertContents(this.pageBtns);

      // Applies fadeIn effect when necessary
      this._fadeIn(renderQuery);

      // Applies highlight and scroll effect to specified item when necessary
      this._hightlightItem(renderQuery);

      // Display msg
      this._displayMsg(renderQuery);
   }

   /**
    * Shows progress form and sets action to be executed when
    * form saved.
    */
   _showProgressForm(instantId){
     if(utils.noConnection(()=>{this._refresh({fadeIn: false, scrollToTop: false});})){return;}
     let saveCallback = (updatedTask) =>{this._updateTask(updatedTask);};

     let task = OPTIONS.activeTasks.getTaskByInstantId(instantId);
     let progressForm = new ProgressForm(saveCallback, task);
     progressForm.displayForm();
   }

   /**
    * Displays a note editor form with the note data
    * of the specified task.
    */
   _showNoteForm(instantId){
     if(utils.noConnection(()=>{this._refresh({fadeIn: false, scrollToTop: false});})){return;}
     let saveCallback = (updatedTask) =>{this._updateTask(updatedTask);};

     let task = OPTIONS.activeTasks.getTaskByInstantId(instantId);
     let noteForm = new NoteEditorForm(saveCallback, task);
     noteForm.displayForm();
   }

   /**
    * Displays task edit form.
    */
   _showEditTaskForm(instantId){
     if(utils.noConnection(()=>{this._refresh({fadeIn: false, scrollToTop: false});})){return;}
     let task = OPTIONS.activeTasks.getTaskByInstantId(instantId);
     let taskForm = new EditActiveTaskForm(this, task);
     taskForm.displayForm();
   }

   /**
    * Toggles 'ongoing' status value for specified task status and
    * refreshes the list.
    */
   _toggleActiveStatus(instantId){
     if(utils.noConnection(()=>{this._refresh({fadeIn: false, scrollToTop: false});})){return;}

     const action = () => {
       OPTIONS.activeTasks.toggleActiveStatus(instantId);
       OPTIONS.updateDb();
       this._refresh({fadeIn: false, scrollToTop: false});
     };
     this._execute(action);
   }

   /**
    * Moves specified task to db task collection with a status value of "Pending"
    */
   _setItemAsPending(instantId){
     if(utils.noConnection(()=>{this._refresh({fadeIn: false, scrollToTop: false});})){return;}

     const action = async () => {
       loader.displayLoader();

       let pendingTask = OPTIONS.activeTasks.makePendingTask(instantId);
       OPTIONS.activeTasks.removeActiveTaskByInstantId(instantId);
       OPTIONS.stats.sumToPending(1);

       await OPTIONS.updateDb();
       await OPTIONS.activeTasks.saveIntoDb([pendingTask]);

       this.show({fadeIn: false, scrollToTop: false, msg: 'See you later!', loader: ()=>{loader.removeLoader();}}, this.searchQuery);
     };
     this._execute(action);
   }

   /**
    * Moves specified task to db task collection with a status value of "Complete"
    */
   _setItemAsComplete(instantId){
     if(utils.noConnection(()=>{this._refresh({fadeIn: false, scrollToTop: false});})){return;}

     const action = async () => {
       let completeTask = OPTIONS.activeTasks.makeCompleteTask(instantId);
       OPTIONS.activeTasks.removeActiveTaskByInstantId(instantId);

       OPTIONS.checkForRecords();
       OPTIONS.stats.sumCompletedTask(1);
       OPTIONS.stats.sumToComplete(1);

       OPTIONS.projects.addToComplete([completeTask]);
       OPTIONS.categories.addToComplete([completeTask]);

       await OPTIONS.updateDb();
       await OPTIONS.activeTasks.saveIntoDb([completeTask]);

       this.show({fadeIn: false, scrollToTop: false}, this.searchQuery);
     };
     this._execute(action);
   }

   /**
    * Moves specified task from db task collection to local option active array.
    */
   _setItemAsActive(instantId){
     if(utils.noConnection(()=>{this._refresh({fadeIn: false, scrollToTop: false});})){return;}

     const action = async () => {

       loader.displayLoader();

       const targetTask = this.listView.getTaskByInstantId(instantId);

       if (targetTask.status=='pending'){
         OPTIONS.stats.restToPending(1);
       }else{
         OPTIONS.stats.restToComplete(1);
       }

       OPTIONS.activeTasks.addToActiveTasks([targetTask]);

       await OPTIONS.updateDb();
       await OPTIONS.activeTasks.removeDbTaskById(targetTask.id);

       this.show({fadeIn: false, scrollToTop: false, msg: 'Reactivated!', loader: ()=>{loader.removeLoader();}}, this.searchQuery);
     };
     this._execute(action);
   }

   /**
    * Removes indicated item from local option active task list
    * and refreshes the page.
    */
   _removeItem(instantId){
     if(utils.noConnection(()=>{this._refresh({fadeIn: false, scrollToTop: false});})){return;}

     const action = async () => {

       loader.displayLoader();

       let removedTask = OPTIONS.activeTasks.getTaskByInstantId(instantId);
       await OPTIONS.activeTasks.removeActiveTaskByInstantId(instantId);

       OPTIONS.categories.restFromCounters([removedTask]);
       OPTIONS.projects.restFromCounters([removedTask]);

       await OPTIONS.updateDb();
       this.show({fadeIn: false, scrollToTop: false, msg: 'Removed!', loader: ()=>{loader.removeLoader();}}, this.searchQuery);
     };
     this._execute(action);
   }




   //---------------------- Data manipulation methods -----------//


   async _updateTask(task){

     const updateTask = () => {
       let taskBUp = OPTIONS.activeTasks.getTaskByInstantId(task.instantId);

       // If different category, update category.
       if(task.categoryId != taskBUp.categoryId){
         OPTIONS.categories.addToCounters([task]);
         OPTIONS.categories.restFromCounters([taskBUp]);
       }

       // If different project, update project.
       if(task.projectId != taskBUp.projectId){
         OPTIONS.projects.addToCounters([task]);
         OPTIONS.projects.restFromCounters([taskBUp]);
       }

       // If different date, update position.
       if(moment(task.dueTo).isSame(taskBUp.dueTo,'day')){
         OPTIONS.activeTasks.updateTask(task);
         this._refresh({fadeIn: false, scrollToTop: false});

       }else{
         OPTIONS.activeTasks.updateAndRepositionTask(task);
         this.show({fadeIn: false, scrollToTop: false, highlightId: task.instantId}, this.searchQuery);
       }
       OPTIONS.updateDb();
     };
     this._execute(updateTask);
   }



   _execute(action){
     // Save backup in case of error
     let optionBUp = OPTIONS.getLocalOptions();

     try {
       action();

     } catch (err) {
       _messanger.showMsgBox('Failed to update task data. Please refresh the page and try again.','error','down');
       console.log(err);
       OPTIONS.updateLocalOptions(optionBUp);
       this.show({fadeIn: true, scrollToTop: false}, this.searchQuery);
     }
   }
 }

 module.exports = new FilteredTaskPage();
