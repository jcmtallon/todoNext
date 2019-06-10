/*jshint esversion: 6 */
const Page = require('./../pages/page');
const OPTIONS = require('./../optionHandler/OptionHandler');
const ActiveTodoListView = require('./activeTodoListView');
const NoteEditorForm = require('./notesForm');
const ProgressForm = require('./progressForm');
const ScoreForm = require('./scoreForm');

class ActiveTodoPage extends Page{
  constructor(){
  super();

    // Page details:
    this.pageName = 'activeTodos';

    // Top bar buttons
    this.quickStatsBtn = {
      id: '',
      text:'Quick stats',
      action: function(){
          alert('Quick stats: coming soon!');}};
    this.logoutBtn = {
      id: 'activeTodos_logout',
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

    if(OPTIONS.activeTodos.isEmpty()){
      this._pageTitle = 'Active tasks';
    }else{
      this._pageTitle = 'Overdue';
    }

    this.setPage();
    this.scrollPageToTop();

    this.listView = new ActiveTodoListView(this.methods);
    let todoList = this.listView.getList();
    this._Editor.insertContents(todoList);
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
   * Removes indicated item from option active todo list
   * and refreshes the page.
   */
  removeListItem(id){

    let callback = () =>{};

    // Instantly remove target list item from list view.
    this.listView.removeItemByInstantId(id);

    let errorHandler = () =>{this.showPage();};
    OPTIONS.activeTodos.removeActiveTaskByInstantId(id, callback, errorHandler);
  }


  /**
   * Saves item with pending status in todos db collection,
   * removes indicated item from option active todo list
   * and refreshes the page.
   */
  setAsPending(id){

    let callback = () =>{};
    let errorHandler = () =>{this.showPage();};

    // Instantly remove target list item from list view.
    this.listView.removeItemByInstantId(id);

    // Update options and database.
    let todo = OPTIONS.activeTodos.getTaskByInstantId(id);
    todo.userId = OPTIONS.userId;
    let pendingTodo = todo.getPendingTodo();
    OPTIONS.activeTodos.sendTaskToDb(id, pendingTodo, callback, errorHandler);
  }



    /**
     * Displays the note editor form with the note data
     * of the selected todo loaded (if there is).
     */
  openNoteEditor(id){
    let errorHandler = () => {this.showPage();};
    let saveCallback = (updatedTodo) =>{
      OPTIONS.activeTodos.updateActiveTask(updatedTodo, null, errorHandler);
      this.showPage();
    };

    let todo = OPTIONS.activeTodos.getTaskByInstantId(id);
    let noteForm = new NoteEditorForm(saveCallback, todo);
    noteForm.displayForm();
  }

  /**
   * Displays the progress editor form with the progress data
   * of the selected todo loaded (if there is).
   */
  openProgressEditor(id){
    let errorHandler = () => {this.showPage();};
    let saveCallback = (updatedTodo) =>{
      OPTIONS.activeTodos.updateActiveTask(updatedTodo, null, errorHandler);
      this.showPage();
    };

    let todo = OPTIONS.activeTodos.getTaskByInstantId(id);
    let progressForm = new ProgressForm(saveCallback, todo);
    progressForm.displayForm();
  }

  /**
   * Displays the score editor form.
   */
  displayScoreForm(id){
    let errorHandler = () => {this.showPage();};

    let saveCallback = (todo) =>{
      todo.userId = OPTIONS.userId;
      let completeTodo = todo.getCompleteTodo();
      OPTIONS.activeTodos.sendTaskToDb(todo.instantId, completeTodo, null, errorHandler);
    };

    let cancelCallback = () =>{this.showPage();};

    let todo = OPTIONS.activeTodos.getTaskByInstantId(id);
    let scoreForm = new ScoreForm(saveCallback, cancelCallback, todo);
    scoreForm.displayForm();
  }

  displayEditListItemForm(id){
    OPTIONS.activeTodos.testingAsync();
  }

}

module.exports = new ActiveTodoPage();
