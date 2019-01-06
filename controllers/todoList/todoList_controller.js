/*jshint esversion: 6 */
const EventEmitter = require('events');
const DbHandler = require('./../DbHandler/DbHandler');
const TodoListView = require('./todoList_view');
const WarWriter = require('./../warFile/warFileWriter');
const HabitFactory = require('./../habitFactory/habitFactory');
const PointFactory = require('./../pointFactory/pointFactory');


module.exports = class TodoListController extends EventEmitter{
  constructor(newTask){
    super(newTask);
    this._newTask = newTask;
    this._db = new DbHandler();
    this._war = new WarWriter();
    this._pointFac = new PointFactory();
    this._habitFac = new HabitFactory(this._db);
    this._view = new TodoListView(this._war, this);

    // When creating this controller, if there is a new task loaded,
    // the task is directly sent to the db.
    if (newTask){newTask.on('dateSaved', _ => this._db.addTask(this._newTask));}

    // When multiple tasks have been saved in the db,
    // adds all the tasks to the war file too.
    this._db.on('todosSaved', todos => this.addTodosToWar(todos));

    // Passes db active tasks to war handler. This compiles the list index data
    // and requests the list view class to print them into the list.
    this._db.on('todosRetrieved', data => this._war.getActiveTodosWarDataAndPrint(data, this._newTodoIds, this._fadeList));

    // When a single task is removed from db,
    // asks war handler to remove the task from the war todolist.
    this._db.on('todoRemoved', id => this._war.removeTodoFromWar(id));

    // Once the dueTo date of a task has been updated,
    // requests the war handler to update the position in the war todolist too.
    this._db.on('dateSaved', updatedTodo => this._war.updateTodoPosition(updatedTodo,this._referenceId,this._over));

    // Once one or multiple habits has been received from the db,
    // requests the habit fabric to generate tasks for these habits
    // (if there are).
    this._db.on('habitSaved', habit => this._habitFac.generateTasks(habit));

    // Once one or multiple habits have been received from the db,
    // requests the habit fabric to generate tasks for these habits.
    // (If there are).
    this._db.on('habitsRetrieved', habits => this._habitFac.generateTasks(habits));

    // Once the db has marked a todo as complete, we request the point factory
    // to generate the corresponding number of points. 
    this._db.on('todoCompleted', updatedTodo => this._pointFac.generatePoints(updatedTodo, this._points));

    // Once new todos have been added to the war file, requests
    // the db all the active tasks so the list view can print them.
    this._war.on('newTodosSaved', _ => this.printTodos({user:'tally', status:'active'},this._newTodoIds));


    // Once we know there are no habit tasks to add, requests
    // db all the acive tasks so they list view can print them.
    this._habitFac.on('printList', _ => this.printTodos({user:'tally', status:'active'},[]));
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

    //Send data to war file
    this._war.addTodosToWarData(todos);
  }



  /**
   * generateAndDisplayTasks - Saves list initial fadein configuration
   * and requests all user habits to the db.
   *
   * @param  {boolean} fadeList indicates if todolist must be displayed with
   *                            and initial fadein or not.
   */
  generateAndDisplayTasks(fadeList){
    this._fadeList = fadeList;
    this._db.getHabits({user:'tally', type:'habit'});
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
    this._newTodoIds = newtodoId;
    this._db.getActiveTodos(request);
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
   * completeTodo - Updates db with the completed todo data.
   *
   * @param  {object} completedTodo necessary data for status update
   * and point fabrication.
   */
  completeTodo(completedTodo){

    // Used later for point counting.
    this._points = completedTodo.hours - completedTodo.progress;

    let delivery = {id:completedTodo.id,
                    status: 'done',
                    progress: completedTodo.hours};

    this._db.completeTask(delivery);
  }

};
