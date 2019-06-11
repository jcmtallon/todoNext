/*jshint esversion: 6 */
const Task = require('./../activeTodos/Task');
const DbHandler = require('./../DbHandler/DbHandler');
const MsgBox = require('./../messageBox/messageBox');

 let _db;
 let _userId;
 let _activeTasks = [];
 let _prevInstantIds = [];
 let _messanger;

module.exports = class ActiveTasks{
  constructor(activeTasks, userId){
    _activeTasks = activeTasks;
    _userId = userId;
    _db = new DbHandler();
    _messanger = new MsgBox();
  }


  /**
   * Returns array with all saved active tasks.
   */
  getActiveTasks(){
    return _activeTasks;
  }

  setActiveTasks(activeTasks){
    _activeTasks = activeTasks;
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
   * Returns true if active task array is empty.
   */
  isEmpty(){
    let result = (_activeTasks.length > 0) ? false : true;
    return result;
  }


  /**
   * Returns the task element that has the ID attribute with
   * the specified value.
   */
  getTaskById(id){
    let dbTask = _activeTasks.find (obj => {return obj._id == id;});
    if (dbTask != undefined){
      let task =  new Task(dbTask);
      return task;
    }
  }

  /**
   * Returns the Task element that has the instant id attribute
   * with the specified value.
   */
  getTaskByInstantId(instantId){
    let dbTask = _activeTasks.find (obj => {return obj.instantId == instantId;});
    if (dbTask != undefined){
      let task =  new Task(dbTask);
      return task;
    }
  }



  /**
   * Returns the id attribute of the task has the instant id
   * attribute with the specified value.
   */
  getIdByInstantId(instantId){
    let dbTask = _activeTasks.find (obj => {return obj.instantId == instantId;});
    if (dbTask != undefined){
      return dbTask._id;
    }
  }


  /**
   * First retrieves an array with all the existing task ids in the list.
   * This array will be used later to identify new tasks in the list
   * so we can highlight them.
   * Second updates the local active task list inserting all received
   * new tasks ordered by their dueTo date.
   * Finally it updates the database.
   */
  addActiveTasks(tasks, callback, errorHandler){
    _prevInstantIds = getActiveTaskInstantIds(_activeTasks);
    addTasksToLocalOptions(tasks);
    updateDatabase(_activeTasks, callback, errorHandler);
  }


  /**
   * Retrieves an array with all the existing task ids in the list.
   * This array will be used later to identify new tasks in the list
   * so we can highlight them.
   * Second updates the local active task list inserting all received
   * new tasks ordered by their dueTo date.
   */
  addToLocalOptions(tasks){
    _prevInstantIds = getActiveTaskInstantIds(_activeTasks);
    addTasksToLocalOptions(tasks);
  }


  /**
   * Updates an existing task with the new
   * task object received, updates the database
   * and executes the callback.
   */
  updateActiveTask(updatedTask, callback, errorHandler){

    _activeTasks = _activeTasks.map((task) => {
      if(task._id == updatedTask.id){
        task.title = updatedTask.title;
        task.dueTo = updatedTask.dueTo;
        task.urgency = updatedTask.urgency;
        task.hours = updatedTask.hours;
        task.progress = updatedTask.progress;
        task.isLearning = updatedTask.isLearning;
        task.status = updatedTask.status;
        task.categoryId = updatedTask.categoryId;
        task.projectId = updatedTask.projectId;
        task.habitId = updatedTask.habitId;
        task.notes = updatedTask.notes;
      }
      return task;
    });
    updateDatabase(_activeTasks, callback, errorHandler);
  }


  /**
   * Updates the db active task array with the
   * local active task information.
   */
  saveActiveTasks(activeTasks){
    _activeTasks = activeTasks;
    updateDatabase(_activeTasks);
  }


  /**
   * Removes an specific task from the active task option arrray
   * and updates the database with the same information.
   */
  removeActiveTaskByInstantId(instantId, callback, errorHandler){

    let task = this.getTaskByInstantId(instantId);

    let index = _activeTasks.map(x => {
      return x.instantId;
    }).indexOf(instantId);
    _activeTasks.splice(index, 1);

    removeTaskFromDb(task._id, callback, errorHandler);
  }



  /**
  * Adds specified task into db complete task collection.
  * Once the addition of the task has been confirmed, removes
  * same task from active task array, both locally and in the db.
  */
  sendTaskToDb(instantId, task, callback, errorHandler){
    if(!navigator.onLine){
      _messanger.showMsgBox('Failed to set task as Pending. \nCheck if there is an internet connection.','error','down');
      if (errorHandler != undefined){errorHandler();}
      return;
    }

    let saveTask = _db.insertTasks([task]);

    // Removes same task from local option active task array.
    saveTask.done((newTask) => {

      this.removeActiveTaskByInstantId(instantId, callback, errorHandler);

    }).fail((err) => {
      _messanger.showMsgBox('An error occurred when updating the task data.\nPlease refresh the page and try again.','error','down');
      console.log(err);
      if (errorHandler != undefined){errorHandler();}
    });
  }



// // TEST
//   testingAsync(){
//     let task =  new Task();
//     task.title = 'Prueba';
//     task.dueTo = new Date();
//     task.urgency = 'Normal';
//     task.hours = '1';
//     task.progress = 0;
//     task.isLearning = false;
//     task.categoryId = '';
//     task.projectId = '';
//     task.habitId = '';
//     task.notes = '';
//     task.generateInstantId();
//     let completeTask = task.getAsListObject();
//     _activeTasks.push(completeTask);
//     let callback = null;
//     let errorHandler = null;
//     updateDatabase(_activeTasks, callback, errorHandler);
//   }
};


//----------------------Options manipulation methods --------------------------//

/*
* Updates the local active task list inserting all received
* new tasks ordered by their dueTo date.
 */
function addTasksToLocalOptions(tasks) {
  $.each(tasks, function( index, task ) {
    task.generateInstantId();
    let listTask = task.getAsListObject();
    _activeTasks = addTaskToListByDueDate(_activeTasks, listTask);
  });
}

//---------------------------- Database methods ---------------------------//

/**
 * Patches data into db activeTask array and executes callback
 * when there is one.
 */
function updateDatabase(tasks, callback, errorHandler){

  const saveTasks = _db.updateOptions(_userId, {activeTasks: tasks});

  saveTasks.done((db) => {
     _activeTasks = db.options.activeTasks;
    if (callback != undefined){callback();}

  }).fail((err) => {
    _messanger.showMsgBox('An error occurred when saving the task data.\nPlease refresh the page and try again.','error','down');
    if (errorHandler != undefined){errorHandler();}
    console.log(err);
  });
}



/**
 * Removes the specified task from the array of active tasks in the
 * db option object.
 */
function removeTaskFromDb(taskId, callback, errorHandler) {

  const removeTask = _db.removeActiveTask(_userId, taskId);

  removeTask.done((db) => {
      if (callback != undefined){callback();}

    }).fail((err) => {
      _messanger.showMsgBox('An error occurred when saving the task data.\nPlease refresh the page and try again.','error','down');
      if (errorHandler != undefined){errorHandler();}
      console.log(err);
    });
}







//----------------------List manipulation methods --------------------------//

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
