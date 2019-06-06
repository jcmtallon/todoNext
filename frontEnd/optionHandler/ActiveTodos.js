/*jshint esversion: 6 */
const Todo = require('./../activeTodos/Todo.js');
const DbHandler = require('./../DbHandler/DbHandler');
const MsgBox = require('./../messageBox/messageBox');

 let _db;
 let _userId;
 let _activeTodos = [];
 let _messanger;

module.exports = class ActiveTodos{
  constructor(activeTodos, userId){
    _activeTodos = activeTodos;
    _userId = userId;
    _db = new DbHandler();
    _messanger = new MsgBox();
  }


  /**
   * Returns array with all saved active todos.
   */
  getActiveTodos(){
    return _activeTodos;
  }


  /**
   * Returns true if active todo array is empty.
   */
  isEmpty(){
    let result = (_activeTodos.length > 0) ? false : true;
    return result;
  }


  /**
   * Returns category class instance for
   * the selected category.
   */
  getTodoById(id){
    let dbTodo = _activeTodos.find (obj => {return obj._id == id;});
    if (dbTodo != undefined){
      let todo =  new Todo(dbTodo);
      return todo;
    }
  }


  /**
   * Receives a category object and the
   * callback to perform as soon as the
   * category has been correctly saved to
   * the database. Returns the callback.
   */
  addActiveTodo(category, callback){
    // let dbCat = category.categoryToDbObject();
    // _categories.push(dbCat);
    // updateDatabase(callback);
  }


  /**
   * Updates an existing todo with the new
   * todo object received, updates the database
   * and exectures the callback.
   */
  updateActiveTodo(updatedTodo, callback, errorHandler){
    _activeTodos = _activeTodos.map((todo) => {
      if(todo._id == updatedTodo.id){
        todo.title = updatedTodo.title;
        todo.dueTo = updatedTodo.dueTo;
        todo.urgency = updatedTodo.urgency;
        todo.hours = updatedTodo.hours;
        todo.progress = updatedTodo.progress;
        todo.isLearning = updatedTodo.isLearning;
        todo.status = updatedTodo.status;
        todo.categoryId = updatedTodo.categoryId;
        todo.projectId = updatedTodo.projectId;
        todo.habitId = updatedTodo.habitId;
        todo.notes = updatedTodo.notes;
      }
      return todo;
    });
    updateDatabase(callback, errorHandler);
  }


  /**
   * Saves this object category array data
   * into the database.
   */
  saveActiveTodos(activeTodos){
    _activeTodos = activeTodos;
    updateDatabase();
  }


  /**
   * Removes an specific todo from the active todos options
   * and updates the database with the same information.
   */
  removeActiveTodoById(id, callback, errorHandler){
    let index = _activeTodos.map(x => {
      return x._id;
    }).indexOf(id);
    _activeTodos.splice(index, 1);
    updateDatabase(callback, errorHandler);
  }


  /**
  * Removes todo from option active todo list and adds it
  * to the complete todo db collection.
   */
  sendTodoToDb(todo, callback, errorHandler){

    if(!navigator.onLine){
      _messanger.showMsgBox('Failed to set task as Pending. \nCheck if there is an internet connection.','error','down');
      if (errorHandler != undefined){errorHandler();}
      return;
    }

    let saveTodo = _db.insertTodos([todo]);

    // Removes the same todo from the option list of active todos.
    saveTodo.done((newTodo) => {
      this.removeActiveTodoById(todo._id, callback, errorHandler);

    }).fail((err) => {
      _messanger.showMsgBox('An error occurred when updating the todo data.\nPlease refresh the page and try again.','error','down');
      console.log(err);
      if (errorHandler != undefined){errorHandler();}
    });
  }
};


/**
 * Patches data into database and executes callback
 * when there is one.
 */
function updateDatabase(callback, errorHandler){

  const saveTodos = _db.updateOptions(_userId, {activeTodos: _activeTodos});

  saveTodos.done((db) => {
    _activeTodos = db.options.activeTodos;
    if (callback != undefined){callback();}

  }).fail((err) => {
    _messanger.showMsgBox('An error occurred when saving the todo data.\nPlease refresh the page and try again.','error','down');
    if (errorHandler != undefined){errorHandler();}
    console.log(err);
  });

}
