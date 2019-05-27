/*jshint esversion: 6 */
const EventEmitter = require('events');
const DbHandler = require('./../DbHandler/DbHandler');
const TodoListView = require('./activeTodoList_view');
const HabitFactory = require('./../habitFactory/habitFactory');
const PointFactory = require('./../pointFactory/pointFactory');
const MsgBox = require('./../messageBox/messageBox');
const OPTIONS = require('./../optionHandler/OptionHandler.js');


module.exports = class TodoListController extends EventEmitter{
  constructor(newTask){
    super(newTask);

    this._newTask = newTask;
    this._db = new DbHandler();
    this._pointFac = new PointFactory(OPTIONS, this._db);
    this._habitFac = new HabitFactory(this._db);
    this._view = new TodoListView(this);
    this._messanger = new MsgBox();


    // When creating this controller, if there is a new task loaded,
    // this listener captures when the user has clicked Submit and saves
    // the new todo into the db.
    if (newTask){newTask.on('dateSaved', todo => this.addTodosToDataBase(todo, this._newTask.type));}



    // Once one or multiple habits has been received from the db,
    // requests the habit fabric to generate tasks for these habits
    // (if there are).
    this._db.on('habitSaved', habit => this._habitFac.generateTasks(habit));
   }


  /**
   * addTodoToWar - Once new tasks have been saved into the database
   * this method sends the tasks to the war handler so they can be
   * added to the war file.
   *
   * @param  {object} todo Object returned by the database.
   */
  addTodosToWar(todos){

    this._newTodoIds=[];

    for(let i=0;i<todos.length;i++){
      this._newTodoIds.push(todos[i]._id);
    }

    // Close add task modal first (if opened)
    this.emit('taskSaved');

    // Register new todos into the options
    // That's were we register the position of each todo in the list.
    OPTIONS.ActiveTodos.addTodos(todos);

    this.printActiveTodos(this._newTodoIds);
  }



  /**
   * addTodosToDataBase - Add all passed todos to database.
   *
   * @param  {Array} todos Array of todo objects
   */
  addTodosToDataBase(todos, type){

    const promiseTodos = this._db.addTodos(todos);
    promiseTodos.done((savedTodos)=>{
      if(type=='habit'){
        this.generateTodos(savedTodos);
      }else{
        this.addTodosToWar(savedTodos);
      }

    }).fail((err)=>{
      this._messanger.showMsgBox('Failed to add todos to database.\nPlease refresh the page and try again.','error','down');
      console.log(err);
    });

  }



  /**
   * generateAndDisplayTasks - Retrieves all user habits from database,
   * requests the habit fabric method to generate all the pending todos
   * for the passed habits and with the received array of todos to create,
   * passes the information to the database.
   *
   * If no tasks need to be added to the system, it calls the printTodos
   * method to print the main list.
   *
   * @param  {boolean} fadeList indicates if todolist must be displayed with
   *                            and initial fadein or not.
   */
  generateAndDisplayTasks(fadeList){
    this._fadeList = fadeList;

    const promiseHabits = this._db.getTodos({user: OPTIONS.userId, type: 'habit'});
    promiseHabits.done((habits)=>{

      this.generateTodos(habits);


    }).fail((err)=>{
      this._messanger.showMsgBox('Failed to retrieve habits.\nPlease refresh the page and try again.','error','down');
      console.log(err);
    });
  }


generateTodos(habits){

  let todos = this._habitFac.generateTasks(habits);
  if(todos.length>0){
    this.addTodosToDataBase(todos);
  }else{
    this.printActiveTodos([]);
  }

}

  /** (PENDING) Make this function private.
   * printTodos - Prints todos in todo list.
   * Requires the active userid and the status of the todos to get.
   *
   * @param  {[String]} newTodoIds
   */
  printActiveTodos(newTodoIds){
    this._newTodoIds = newTodoIds;

    let request = {user: OPTIONS.userId, status:'active'};

    const promiseTodos = this._db.getTodos(request);

    promiseTodos.done((todos) =>{

      let currentPage = localStorage.getItem('currentPage');
      if (currentPage == 'activeTodos'){
        this._view.printTodos({options: OPTIONS.options,
          todos: todos,
          newTodoId: this._newTodoIds,
          fadein: this._fadeList});
      }

    }).fail((err)=>{
      this._messanger.showMsgBox('Failed to retrieve active items.\nPlease refresh the page and try again.','error','down');
      console.log(err);
    });

  }


  refreshActiveTodoList(){
    this._fadeList = false;
    this.printActiveTodos([]);
  }


  /**
   * removeTodoFromDb - description
   *
   * @param  {string} id id of the todo to remove.
   */
  removeTodoFromDb(id){

    OPTIONS.ActiveTodos.removeTodoById(id);

    const promiseToUpdate = this._db.updateTodoById(id, {status: 'removed'});

    promiseToUpdate.done((todo)=>{}).fail((err)=>{
      this._messanger.showMsgBox('Failed to remove item from database.\nPlease refresh the page and try again.','error','down');
      console.log(err);
    });
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

    this._referenceId = referenceId;
    this._over = over;

    const promiseToUpdate = this._db.updateTodoById(currentId, {dueTo: newDate});

    promiseToUpdate.done((updatedTodo)=>{
      OPTIONS.ActiveTodos.updateTodoIndex(updatedTodo, this._referenceId, this._over);

    }).fail((err)=>{
      this._messanger.showMsgBox('Failed to update date in database.\nPlease refresh the page and try again.','error','down');
      console.log(err);
    });
  }




  /**
   * completeTodo - Updates db with the completed todo data.
   * @public
   * @param  {object} completedTodo necessary data for status update
   * and point fabrication.
   */
  completeTodo(completedTodo){

    let finalProgress;

    if(completedTodo.hours == 'Score'){
      this._points = completedTodo.progress;
      finalProgress = completedTodo.progress;
    }else{
      this._points = completedTodo.hours - completedTodo.progress;
      finalProgress = Number(completedTodo.hours);
    }

    OPTIONS.ActiveTodos.removeTodoById(completedTodo.id);

    const promiseToUpdate = this._db.updateTodoById(completedTodo.id,
                                                    {status: 'done',
                                                     progress: finalProgress});

    promiseToUpdate.done((todo)=>{
      this._pointFac.generatePoints(todo, this._points);

    }).fail((err)=>{
      this._messanger.showMsgBox('Failed to mark item as complete.\nPlease refresh the page and try again.','error','down');
      console.log(err);
    });

  }





  /**
   * sendPoints - Requests the Point Factory to register one
   * point under the passed ID.
   *
   * @param  {type} pointId description
   * @return {type}         description
   */
  sendPoint(pointId, todo){
    this._pointFac.savePointWithId(pointId, todo);
  }


  /**
   * removePoint - Removes the indicated point from
   * the database.
   *
   * @param  {String} pointId description
   */
  removePoint(pointId){
    this._pointFac.removePointWithId(pointId);
  }





  /**
   * updateTaskProgress - Saves progress into db task.
   *
   * @param  {Object} request includes id and properties to update
   */
  updateTaskProgress(currentId, request){

    const promiseToUpdate = this._db.updateTodoById(currentId, request);

    promiseToUpdate.done((todo)=>{}).fail((err)=>{
      this._messanger.showMsgBox('Failed to save task progress.\nPlease refresh the page and try again.','error','down');
      console.log(err);
    });
  }

};
