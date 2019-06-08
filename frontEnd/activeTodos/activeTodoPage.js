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
    this._pageTitle = 'Overdue';

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
      displayScoreForm: (id) => {this.displayScoreForm(id);}
       // editItem: (id) => {this.displayEditListItemForm(id);}
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

  updateIds(){

  }


  /**
   * Removes indicated item from option active todo list
   * and refreshes the page.
   */
  removeListItem(id){
    let callback = () =>{};

    // Instantly remove target list item from list view.
    this.listView.removeItemById(id);

    let errorHandler = () =>{this.showPage();};
    OPTIONS.activeTodos.removeActiveTodoById(id, callback, errorHandler);
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
    this.listView.removeItemById(id);

    // Update options and database.
    let todo = OPTIONS.activeTodos.getTodoById(id);
    todo.userId = OPTIONS.userId;
    let pendingTodo = todo.getPendingTodo();
    OPTIONS.activeTodos.sendTodoToDb(pendingTodo, callback, errorHandler);
  }



    /**
     * Displays the note editor form with the note data
     * of the selected todo loaded (if there is).
     */
  openNoteEditor(id){
    let errorHandler = () => {this.showPage();};
    let saveCallback = (updatedTodo) =>{
      OPTIONS.activeTodos.updateActiveTodo(updatedTodo, null, errorHandler);
      this.showPage();
    };

    let todo = OPTIONS.activeTodos.getTodoById(id);
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
      OPTIONS.activeTodos.updateActiveTodo(updatedTodo, null, errorHandler);
      this.showPage();
    };

    let todo = OPTIONS.activeTodos.getTodoById(id);
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
      OPTIONS.activeTodos.sendTodoToDb(completeTodo, null, errorHandler);
    };

    let cancelCallback = () =>{this.showPage();};

    let todo = OPTIONS.activeTodos.getTodoById(id);
    let scoreForm = new ScoreForm(saveCallback, cancelCallback, todo);
    scoreForm.displayForm();
  }

}

module.exports = new ActiveTodoPage();
