/*jshint esversion: 9 */
const Page = require('./../pages/page');
const OPTIONS = require('./../optionHandler/OptionHandler');
const ActiveTaskListView = require('./activeTaskListView');
const EditActiveTaskForm = require('./activeTaskEditForm');
const HabitTaskFactory = require('./../habits/habitTaskFactory');
const NoteEditorForm = require('./notesForm');
const ProgressForm = require('./progressForm');
const ScoreForm = require('./scoreForm');
const MsgBox = require('./../messageBox/messageBox');
const moment = require('moment');
const utils = require('./../utilities/utils');

let _messanger;

class ActiveTaskPage extends Page{
  constructor(){
    super();

    _messanger = new MsgBox();

    // Page details:
    this.pageName = 'activeTasks';

    // Top bar buttons
    this.quickStatsBtn = {
      id: '',
      text:'Quick stats',
      action: function(){
          alert('Quick stats: coming soon!');}};

    this.logoutBtn = {
      id: 'activeTasks_logout',
      text:'Logout',
      action: function(){
        window.open('/users/logout','_self');}};

    this._topBarBtns = [this.quickStatsBtn, this.logoutBtn];


    // List item menu actions.
    this.methods = {
      showPage: () => {this.showPage();},
      removeItem: (instantId) => {this.removeItemByInstantId(instantId);},
      setAsPending : (instantId) => {this.setItemAsPending(instantId);},
      setAsComplete : (instantId) => {this.markTaskAsComplete(instantId);},
      openNoteEditor : (instantId) => {this.openNoteEditor(instantId);},
      openProgressEditor: (instantId) => {this.openProgressEditor(instantId);},
      displayScoreForm: (instantId) => {this.displayScoreForm(instantId);},
      editItem: (instantId) => {this.displayEditListItemForm(instantId);}
    };
  }











  //-------------------- Habits --------------//

  /**
   * Check if new habit tasks must be generated.
   * If affirmative, generates tasks, refreshes lastHabitDate
   * and saves option object into db.
   */
  checkHabits(){
    OPTIONS.activeTasks.rememberInstantIds();

    if (OPTIONS.logs.mustGenerateHabits()){
      let optBUp = OPTIONS.getLocalOptions();
      this.generateHabitTasks();
      OPTIONS.logs.setLastHabitDateAsToday();
      this.saveOptions(optBUp);
    }
  }

  /**
   * Generates new habit tasks.
   */
  generateHabitTasks(){
      let factory = new HabitTaskFactory();
      factory.generateHabitTasks();
  }













  //--------------- Show page ----------------------//

  /**
   * Removes existing elements in the editor and editor
   * top bar and appends new list view
   */
  showPage(noScroll){

    localStorage.setItem('currentPage', this.pageName);

    if(OPTIONS.activeTasks.isEmpty()){
      this._pageTitle = 'Active tasks';
    }else{
      this._pageTitle = 'Overdue';
    }

    this.setPage();
    if(!noScroll){this.scrollPageToTop();}

    this.listView = new ActiveTaskListView(this.methods);
    let taskList = this.listView.getList();
    this._Editor.insertContents(taskList);
  }

  /**
   * Refreshes the screen without scrolling.
   */
  showPageWithoutScroll(){
    let noScroll = true;
    this.showPage(noScroll);
  }

  /**
   * Shows page with fade in effect at the beginning.
   */
  showPageWithFadeIn(){
    this.showPage();
    this.listView.fadeInList();
  }

  /**
   * Shows page with fade in highlighting all new items
   * in the list.
   */
  showPageWithFadeInAndHightlights(){
    this.showPage();
    this.listView.fadeInList();
    this.listView.hightlightNewItems();
  }

  /**
   * Shows page highlighting all new items
   * in the list.
   */
  showPageWithHightlights(){
    this.showPage();
    this.listView.hightlightNewItems();
  }

  /**
   * Shows page highlighting specified item
   */
  showPageAndHightlightByInstantId(instantId){
    this.showPage();
    this.listView.hightlightByInstantId(instantId);
  }












  // --------------- Task methods -------------------//

  /**
   * Removes indicated item from option active task list
   * and refreshes the page.
   */
  removeItemByInstantId(instantId){

    if(utils.noConnection(()=>{this.showPageWithFadeIn();})){return;}

    let optionBUp = OPTIONS.getLocalOptions();
    let removedTask = OPTIONS.activeTasks.getTaskByInstantId(instantId);

    this.listView.removeItemByInstantId(instantId);
    OPTIONS.activeTasks.removeActiveTaskByInstantId(instantId);

    // Udpates stats (if necessary)
    OPTIONS.categories.restFromCounters([removedTask]);
    OPTIONS.projects.restFromCounters([removedTask]);

    this.saveOptions(optionBUp);
  }

  /**
   * Saves specified task into the database task collection
   * as a pending task. Updates the pending task counter and
   * updates the listview and local option object.
   */
  setItemAsPending(instantId){

    if(utils.noConnection(()=>{this.showPageWithFadeIn();})){return;}

    let optionBUp = OPTIONS.getLocalOptions();
    let pendingTask = OPTIONS.activeTasks.makePendingTask(instantId);

    this.listView.removeItemByInstantId(instantId);
    OPTIONS.activeTasks.removeActiveTaskByInstantId(instantId);

    OPTIONS.stats.sumToPending(1);

    try{
      OPTIONS.updateDb();
      OPTIONS.activeTasks.saveIntoDb([pendingTask]);

    } catch (err){
      _messanger.showMsgBox('Failed to save data.\nPlease refresh the page and try again.','error','down');
      console.log(err);
      OPTIONS.updateLocalOptions(optionBUp);
      OPTIONS.updateDb();
      this.showPageWithFadeIn();
    }
  }

  /**
   * Saves specified task into the database task collection
   * as a complete task. Updates the pending task counter and
   * updates the listview and local option object.
   */
  markTaskAsComplete(instantId){

    let optionBUp = OPTIONS.getLocalOptions();
    let completeTask = OPTIONS.activeTasks.makeCompleteTask(instantId);

    this.listView.removeItemByInstantId(instantId);
    OPTIONS.activeTasks.removeActiveTaskByInstantId(instantId);

    OPTIONS.stats.sumToComplete(1);
    OPTIONS.projects.addToComplete([completeTask]);
    OPTIONS.categories.addToComplete([completeTask]);

    try{
      OPTIONS.updateDb();
      OPTIONS.activeTasks.saveIntoDb([completeTask]);

    } catch (err){
      _messanger.showMsgBox('Failed to save data.\nPlease refresh the page and try again.','error','down');
      console.log(err);
      OPTIONS.updateLocalOptions(optionBUp);
      OPTIONS.updateDb();
      this.showPageWithFadeIn();
    }
  }

  /**
   *  Updates existing task with new task data and
   *  refreshes the screen.
   */
  async updateActiveTask(task){

    let optionBUp = OPTIONS.getLocalOptions();
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
      this.showPageWithoutScroll();
    }else{
      OPTIONS.activeTasks.updateAndRepositionTask(task);
      this.showPageAndHightlightByInstantId(task.instantId);
    }

    try{
      OPTIONS.updateDb();

    } catch (err){
      _messanger.showMsgBox('Failed to update task data. Please refresh the page and try again.','error','down');
      console.log(err);
      OPTIONS.updateLocalOptions(optionBUp);
      this.showPageWhFadeIn();
    }
  }











  // ---------------------- Forms -------------------//

  /**
   * Displays the note editor form with the note data
   * of the selected task loaded (if there is).
   */
  openNoteEditor(instantId){
    let saveCallback = (updatedTask) =>{
      this.updateActiveTask(updatedTask);
    };

    let task = OPTIONS.activeTasks.getTaskByInstantId(instantId);
    let noteForm = new NoteEditorForm(saveCallback, task);
    noteForm.displayForm();
  }

  /**
   * Displays the progress editor form with the progress data
   * of the selected task loaded (if there is).
   */
  openProgressEditor(instantId){
    let saveCallback = (updatedTask) =>{
      this.updateActiveTask(updatedTask);
    };

    let task = OPTIONS.activeTasks.getTaskByInstantId(instantId);
    let progressForm = new ProgressForm(saveCallback, task);
    progressForm.displayForm();
  }

  /**
   * Displays active task editor form.
   */
  displayEditListItemForm(instantId){
    let targetTask = OPTIONS.activeTasks.getTaskByInstantId(instantId);
    let taskForm = new EditActiveTaskForm(this, targetTask);
    taskForm.displayForm();
  }

  /**
   * Displays the score editor form.
   */
  displayScoreForm(instantId){

    if(utils.noConnection(()=>{this.showPageWithFadeIn();})){return;}

    let saveCallback = (task) =>{
      this.markTaskAsComplete(instantId);
    };

    let cancelCallback = () =>{
      this.showPageWithoutScroll();
    };

    let task = OPTIONS.activeTasks.getTaskByInstantId(instantId);
    let scoreForm = new ScoreForm(saveCallback, cancelCallback, task);
    scoreForm.displayForm();
  }












  //-------------------- Save options --------------//

    /**
     * Saves latest version of option object into db.
     * If failes, restores options with specified backup.
     */
    saveOptions(optBUp){
      try {
        OPTIONS.updateDb();

      } catch (err){
        _messanger.showMsgBox('Failed to save new data. Please refresh the page and try again.','error','down');
        console.log(err);
        OPTIONS.updateLocalOptions(optBUp);
        this.showPageWithFadeIn();
      }
    }

}

module.exports = new ActiveTaskPage();
