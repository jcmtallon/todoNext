/*jshint esversion: 6 */
const Page = require('./../pages/page');
const OPTIONS = require('./../optionHandler/OptionHandler');
const ActiveTaskListView = require('./activeTaskListView');
const EditActiveTaskForm = require('./activeTaskEditForm');
const NoteEditorForm = require('./notesForm');
const ProgressForm = require('./progressForm');
const ScoreForm = require('./scoreForm');

class ActiveTaskPage extends Page{
  constructor(){
  super();

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
      removeItem: (id) => {this.removeListItem(id);},
      setAsPending : (id) => {this.setAsPending(id);},
      openNoteEditor : (id) => {this.openNoteEditor(id);},
      openProgressEditor: (id) => {this.openProgressEditor(id);},
      displayScoreForm: (id) => {this.displayScoreForm(id);},
      editItem: (id) => {this.displayEditListItemForm(id);}
    };
  }


  /**
   * Removes existing elements in the editor and editor
   * top bar and appends new list view
   */
  showPage(){
    localStorage.setItem('currentPage', this.pageName);

    if(OPTIONS.activeTasks.isEmpty()){
      this._pageTitle = 'Active tasks';
    }else{
      this._pageTitle = 'Overdue';
    }

    this.setPage();
    this.scrollPageToTop();

    this.listView = new ActiveTaskListView(this.methods);
    let taskList = this.listView.getList();
    this._Editor.insertContents(taskList);
  }


  /**
   * Shows page with fade in effect at the beginning.
   */
  showPageWithFadeIn(){
    this.showPage();
    this.listView.fadeInList();
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
   * Removes indicated item from option active task list
   * and refreshes the page.
   */
  removeListItem(id){

    let callback = () =>{};

    // Instantly remove target list item from list view.
    this.listView.removeItemByInstantId(id);

    let errorHandler = () =>{this.showPage();};
    OPTIONS.activeTasks.removeActiveTaskByInstantId(id, callback, errorHandler);
  }


  /**
   * Saves item with pending status in tasks db collection,
   * removes indicated item from option active task list
   * and refreshes the page.
   */
  setAsPending(id){

    let callback = () =>{};
    let errorHandler = () =>{this.showPage();};

    // Instantly remove target list item from list view.
    this.listView.removeItemByInstantId(id);

    // Update options and database.
    let task = OPTIONS.activeTasks.getTaskByInstantId(id);
    task.userId = OPTIONS.userId;
    let pendingTask = task.getPendingTask();
    OPTIONS.activeTasks.sendTaskToDb(id, pendingTask, callback, errorHandler);
  }



    /**
     * Displays the note editor form with the note data
     * of the selected task loaded (if there is).
     */
  openNoteEditor(id){
    let errorHandler = () => {this.showPage();};
    let saveCallback = (updatedTask) =>{
      OPTIONS.activeTasks.updateActiveTask(updatedTask, null, errorHandler);
      this.showPage();
    };

    let task = OPTIONS.activeTasks.getTaskByInstantId(id);
    let noteForm = new NoteEditorForm(saveCallback, task);
    noteForm.displayForm();
  }

  /**
   * Displays the progress editor form with the progress data
   * of the selected task loaded (if there is).
   */
  openProgressEditor(id){
    let errorHandler = () => {this.showPage();};
    let saveCallback = (updatedTask) =>{
      OPTIONS.activeTasks.updateActiveTask(updatedTask, null, errorHandler);
      this.showPage();
    };

    let task = OPTIONS.activeTasks.getTaskByInstantId(id);
    let progressForm = new ProgressForm(saveCallback, task);
    progressForm.displayForm();
  }

  /**
   * Displays the score editor form.
   */
  displayScoreForm(id){
    let errorHandler = () => {this.showPage();};

    let saveCallback = (task) =>{
      task.userId = OPTIONS.userId;
      let completeTask = task.getCompleteTask();
      OPTIONS.activeTasks.sendTaskToDb(task.instantId, completeTask, null, errorHandler);
    };

    let cancelCallback = () =>{this.showPage();};

    let task = OPTIONS.activeTasks.getTaskByInstantId(id);
    let scoreForm = new ScoreForm(saveCallback, cancelCallback, task);
    scoreForm.displayForm();
  }


  displayEditListItemForm(instantId){
    let targetTask = OPTIONS.activeTasks.getTaskByInstantId(instantId);
    let taskForm = new EditActiveTaskForm(this, targetTask);
    taskForm.displayForm();
  }

}

module.exports = new ActiveTaskPage();
