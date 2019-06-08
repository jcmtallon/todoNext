/*jshint esversion: 6 */
const Todo = require('./../activeTodos/Todo.js');
const DbHandler = require('./../DbHandler/DbHandler');
const MsgBox = require('./../messageBox/messageBox');

 let _db;
 let _userId;
 let _activeTodos = [];
 let _prevInstantIds = [];
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
   * Returns the list of task ids that existed in the
   * active task list before the last batch of tasks
   * was added to the list. Used so the listview can identify
   * which tasks in the list are new.
   */
  getPreviousInstantIds(){
    return _prevInstantIds;
  }


  /**
   * Returns true if active todo array is empty.
   */
  isEmpty(){
    let result = (_activeTodos.length > 0) ? false : true;
    return result;
  }


  /**
   * Returns task object for passed id.
   */
  getTodoById(id){
    let dbTodo = _activeTodos.find (obj => {return obj._id == id;});
    if (dbTodo != undefined){
      let todo =  new Todo(dbTodo);
      return todo;
    }
  }

  /**
   * Returns task object for passed instant id.
   */
  getTodoByInstantId(instantId){
    let dbTodo = _activeTodos.find (obj => {return obj.instantId == instantId;});
    if (dbTodo != undefined){
      let todo =  new Todo(dbTodo);
      return todo;
    }
  }



  /**
   * Returns id of task with corresponding instant id.
   */
  getIdByInstantId(instantId){
    let dbTodo = _activeTodos.find (obj => {return obj.instantId == instantId;});
    if (dbTodo != undefined){
      return dbTodo._id;
    }
  }


  /**
   * First retrieves an array with all the existing task ids in the list.
   * This array will be used later to identify new tasks in the list
   * so we can highlight them.
   * Second updates the local active task list inserting all received
   * new tasks ordered by their dueTo date.
   */
  addActiveTasks(tasks, callback, errorHandler){

    _prevInstantIds = getActiveTaskInstantIds(_activeTodos);

    $.each(tasks, function( index, task ) {
      task.generateInstantId();
      let listTask = task.getAsListObject();
      _activeTodos = addTaskToListByDueDate(_activeTodos, listTask);
    });

    updateDatabase(_activeTodos, callback, errorHandler);
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
    let clone = _activeTodos.slice();
    updateDatabase(clone, callback, errorHandler);
  }


  /**
   * Saves this object category array data
   * into the database.
   */
  saveActiveTodos(activeTodos){
    _activeTodos = activeTodos;
    let clone = _activeTodos.slice();
    updateDatabase(clone);
  }


  /**
   * Removes an specific todo from the active todos options
   * and updates the database with the same information.
   */
  removeActiveTodoByInstantId(id, callback, errorHandler){
    let index = _activeTodos.map(x => {
      return x.instantId;
    }).indexOf(id);
    _activeTodos.splice(index, 1);
    let clone = _activeTodos.slice();
    updateDatabase(clone, callback, errorHandler);
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
      this.removeActiveTodoByInstantId(todo._id, callback, errorHandler);

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
function updateDatabase(clone, callback, errorHandler){

  const saveTodos = _db.updateOptions(_userId, {activeTodos: clone});

  saveTodos.done((db) => {
     _activeTodos = db.options.activeTodos;
    if (callback != undefined){callback();}

  }).fail((err) => {
    _messanger.showMsgBox('An error occurred when saving the todo data.\nPlease refresh the page and try again.','error','down');
    if (errorHandler != undefined){errorHandler();}
    console.log(err);
  });

}


/**
 * If list is empty, instantly returns the list
 * populated only with the given task.
 * If not, iterates a copy of the list until it finds
 * the first position in which the new task has a
 * larger date than the currently loop item, slices
 * the item in there and instantly return the list in
 * that state.
 */
function addTaskToListByDueDate(list, task) {

  let newList = [];
  let taskDueTo = new Date(task.dueTo);
  taskDueTo.setHours(0,0,0,0);

  if (list.length == 0){
    newList.push(task);
    return newList;
  }

  newList = list.slice();

  for(let i=0; i<newList.length; i++){

    let listItemDueTo = new Date(newList[i].dueTo);
    listItemDueTo.setHours(0,0,0,0);

    if(listItemDueTo > taskDueTo){
      newList.splice(i, 0, task);
      return newList;
    }
  }
  newList.push(task);
  return newList;
}



/**
 * Returns an array with all the task ids
 * in the active task list.
 */
function getActiveTaskInstantIds(tasks) {

  let ids = [];
  $.each(tasks, function( index, task ) {
    ids.push(task.instantId);
  });
  return ids;

}
