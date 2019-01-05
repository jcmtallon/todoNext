/*jshint esversion: 6 */
const EventEmitter = require('events');
const DbHandler = require('./../DbHandler/DbHandler');
const TodoListView = require('./todoList_view');
const WarWriter = require('./../warFile/warFileWriter');


module.exports = class TodoListController extends EventEmitter{
  constructor(newTask){
    super(newTask);
    this._newTask = newTask;
    this._db = new DbHandler();
    this._war = new WarWriter();
    this._view = new TodoListView(this._war,this);

    if (newTask){newTask.on('dateSaved', _ => this.addNewTodo());}
    this._db.on('todoSaved', data => this.addTodoToWar(data));
    this._db.on('todosRetrieved', data => this.contrastTodosWithWar(data));
    this._db.on('todoRemoved', id => this.removeTodoFromWar(id));
    this._db.on('dateSaved', updatedTodo => this.updateDateInWar(updatedTodo));
    this._war.on('newTodoSaved', _ => this.printTodos({user:'tally', status:'active'},this._newTodoID));
    this._war.on('newHabitSaved', firstHabit => this.addFirstHabit(firstHabit));
   }


  /**
   * addNewTodo - If new todo is a task, the todo is directly saved into the db.
   * If the new todo is a habit, it is sent to the war file which is in charge of
   * generating the periodical habit items.
   */
  addNewTodo(){
    if(this._newTask.type=='task'){
      this._db.addTask(this._newTask);
    }else{
      this._war.addHabit(this._newTask);
    }
  }



  /**
   * addFirstHabit - Updates this._newTask property with the passed
   * todo and requests addNewTodo method to add the todo to the db, war and list.
   *
   * @param  {object} task task to add to the db.
   */
  addFirstHabit(task){
    this._db.addTask(task);
  }



  /**
   * addTodoToWar - Once the new todo item has been saved into the database
   * this method requests the new task modal view to close the window
   * and it sends the new todo data to the War file controller so this data
   * can be added to the res file.
   *
   * @param  {object} todo Object returned by the database.
   */
  addTodoToWar(todo){
    this._newTodoID = todo._id;

    // Close add task modal first
    this.emit('taskSaved');

    //Send data to war file
    this._war.addTodoToWarData(todo);
  }


  /**
   * printTodos - Prints todos in todo list.
   * Requires the active userid and the status of the todos to get.
   *
   * @param  {object} request e.{user:'xxx', status:'xxx'}
   * @return {emit}       Once the data was retrieved from the db,
   *                      the db emits an event that this same class catches.
   */
  printTodos(request, newtodoId){
    this._newTodoID = newtodoId;
    this._db.getActiveTodos(request);
  }


  /**
   * contrastTodosWithWar - Sends data to warFileWriter Class so this class
   * can also retrieve the index information from the active user war file
   * and print the todos in the todo list in the order that was customized by
   * the user
   *
   * @param  {type} todosCol an array of active todos
   * @return {type}          Once the war file data is retrieved by the
   * warFileWriter class, this class calls the todoListView class that will
   * print the todos.
   */
  contrastTodosWithWar(todosCol){
    this._war.getActiveTodosWarDataAndPrint(todosCol, this._newTodoID);
  }




  /**
   * removeTodoFromDb - description
   *
   * @param  {string} id id of the todo to remove.
   */
  removeTodoFromDb(id){
    this._db.removeTask(id);
  }


  /**
   * removeTodoFromWar - Requests the war controller to remove the todo from
   * the res file.
   *
   * @param  {string} id removed todo id
   */
  removeTodoFromWar(id){
    this._war.removeTodoFromWar(id);
  }



  /**
   * updatePosition - Requests db handler to update dueTo for passed todo.
   *
   * @param  {string} currentId   id of todo to modify
   * @param  {string} referenceId id of neighbour todo
   * @param  {date} newDate     dueto date to save
   * @param  {boolean} over       position of neighbour todo
   * @return {emit}               db handler emits a message back to this class.
   */
  updatePosition(currentId, referenceId, newDate, over){
    this._referenceId=referenceId;
    this._over=over;
    this._db.updateDate(currentId, newDate);
  }



/**
 * updateDateInWar - Once the dueTo date has been updated in the database,
 * it updates the resource file with the same information.
 *
 * @param  {object} updatedTodo data of the updatedTodo
 */
updateDateInWar(updatedTodo){
    this._war.updateTodoPosition(updatedTodo,this._referenceId,this._over);
  }
};
