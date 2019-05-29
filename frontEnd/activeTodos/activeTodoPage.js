/*jshint esversion: 6 */
const Page = require('./../pages/page');
// const TodoListController = require('./../activeTodos/activeTodoList_controller');
const ActiveTodoListView = require('./activeTodoListView');
const OPTIONS = require('./../optionHandler/OptionHandler');


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
    this.actions = {
       // removeItem: (id) => {this.removeListItem(id);},
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

    this.listView = new ActiveTodoListView(this.actions);
    let todoList = this.listView.getList();
    this._Editor.insertContents(todoList);
  }


  showPageWithFadeIn(){
    this.showPage();
    this.listView.fadeInList();
  }

}

module.exports = new ActiveTodoPage();
