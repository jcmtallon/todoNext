const Task = require('./../activeTodos/Task');
const DbHandler = require('./../DbHandler/dbHandler');
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

  /**
   * Returns a copy of the activeTask array.
   * Used for creating temporary backups.
   */
   getActiveTaskCopy(){
     return JSON.parse(JSON.stringify(_activeTasks));
  }

  /**
   * Filters tasks that matches the conditions given in
   * the specified query.
   *
   * @param  {Object} query E.g. {status='complete', size=7, categoryId='fasf', projectId ='asdfas', page = 1}
   * @return {Array}      Array of db objects.
   */
  getTasksByQuery(query){

    // Return all active tasks if query is undefined.
    if (query == undefined) return {tasks: _activeTasks, totalCount: _activeTasks.length};

    // Secure that query has all necessary properties for the filtering process.
    if (!query.hasOwnProperty('status')) query.status = undefined;
    if (!query.hasOwnProperty('categoryId')) query.categoryId = undefined;
    if (!query.hasOwnProperty('projectId')) query.projectId = undefined;
    if (!query.hasOwnProperty('habitId')) query.habitId = undefined;
    if (!query.hasOwnProperty('pageNb')) query.pageNb = 1;

    // Returns empty array if no active status.
    if(query.status=='pending' || query.status == 'complete') return {tasks: [], totalCount: 0};

    // Filter by status
    const statusFilteredTasks = _activeTasks.filter(obj => {
      if(query.status=='ongoing'){
        return obj.status == 'ongoing';
      }else{
        return true;
      }
    });

    // Filter by category
    const catFilteredTasks = statusFilteredTasks.filter(obj => {
      if(query.categoryId!=undefined){
        return obj.categoryId == query.categoryId;
      }else{
        return true;
      }
    });

    // Filter by habit
    const habFilteredTasks = catFilteredTasks.filter(obj => {
      if(query.habitId!=undefined){
        return obj.habitId == query.habitId;
      }else{
        return true;
      }
    });

    // Filter by project and return
    const projFilteredTasks = habFilteredTasks.filter(obj => {
      if(query.projectId!=undefined){
        return obj.projectId == query.projectId;
      }else{
        return true;
      }
    });

    // Remember total count before slice the data into pages.
    let totalCount = projFilteredTasks.length;

    // Filter result by page
    const skip = query.size * (query.pageNb - 1);
    if(skip == 0){
      return {tasks: projFilteredTasks.slice(skip, query.size), totalCount: totalCount};
    }else{
      return {tasks: projFilteredTasks.slice(skip, skip + query.size), totalCount: totalCount};
    }
  }


  /**
   * Get number of elements in the array.
   */
  getNbOfItems(){
    return _activeTasks.length;
  }

  //TODO
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
   * Retrieves an array with all the existing task ids in the list.
  * This array will be used later to identify new tasks in the list
  * so we can highlight them.
  */
  rememberInstantIds(){
    _prevInstantIds = getActiveTaskInstantIds(_activeTasks);
  }


  /**
   * Updates the local active task list inserting all received
   * new tasks ordered by their dueTo date.
   */
  addToActiveTasks(tasks){
    addTasksToLocalOptions(tasks);
  }


  /** TODO: get rid of this method and only use updateTask()
   * Updates an existing task with the new
   * task object received, updates the database
   * and executes the callback.
   */
  updateActiveTask(updatedTask, callback, errorHandler){

    _activeTasks = _activeTasks.map((task) => {
      if(task.instantId == updatedTask.instantId){
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
   * Updates an existing task with the new
   * task object received.
   */
  updateTask(updatedTask){
    _activeTasks = _activeTasks.map((task) => {
      if(task.instantId == updatedTask.instantId){
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
        task._id = updatedTask._id;
      }
      return task;
    });
  }

  updateAndRepositionTask(updatedTask){

    // Remove target task from _activeTasks
    let index = _activeTasks.map(x => {
      return x.instantId;
    }).indexOf(updatedTask.instantId);
    _activeTasks.splice(index, 1);

    // Reposition and insert based on due to
    let listTask = updatedTask.getAsListObject();
    _activeTasks = addTaskToListByDueDate(_activeTasks, listTask);
  }


  /**
   * Updates categoryId data of all those active tasks
   * with the same project Id.
   */
  updateActiveTasksWithProject(project){
    let nbOfChanges = 0;
    _activeTasks = _activeTasks.map((task) => {
      if(task.projectId == project.id){
        task.categoryId = project.categoryId;
        nbOfChanges++;
      }
      return task;
    });
    return nbOfChanges;
  }

  /**
   * Updates the database activeTasks array with the local activeTasks array info.
   */
  updateDb(){
    return _db.updateOptions(_userId, {activeTasks: _activeTasks});
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
   * Removes an specific task from the
   * active task option array.
   */
  removeActiveTaskByInstantId(instantId){
    let index = _activeTasks.map(x => {
      return x.instantId;
    }).indexOf(instantId);
    _activeTasks.splice(index, 1);
  }



  /**
   * Generates a clone of the specified task
   * and returns it with a status value of "pending"
   *
   * @param  {String} instantId
   * @return {Object} Task db object with pending status value.
   */
  makePendingTask(instantId){
    let task = this.getTaskByInstantId(instantId);
    task.userId = _userId;
    return task.getPendingTask();
  }


  /**
   * Changes status value of specified active task to 'ongoing'.
   * @param  {String} instantId
   */
  toggleActiveStatus(instantId){
    _activeTasks = _activeTasks.map((task) => {
      if(task.instantId == instantId){
        task.status = (task.status=='ongoing') ? '' : 'ongoing';
      }
      return task;
    });
  }

  /**
   * Generates a clone of the specified task
   * and returns it with a status value of "complete"
   *
   * @param  {String} instantId
   * @return {Object} Task db object with complete status value.
   */
  makeCompleteTask(instantId){
    let task = this.getTaskByInstantId(instantId);
    task.userId = _userId;
    return task.getCompleteTask();
  }


  /**
   * Removes single item from task db collection.
   * @param  {String} id
   * @return {Object} server response
   */
  async removeDbTaskById(id){
    return _db.removeTaskByID(id);
  }


  /**
   * Saves passed array of task db objects into Database
   * task collection.
   * @param  {array} tasks array of task db objects
   * @return {promise}
   */
  saveIntoDb(tasks){
    return _db.insertTasks(tasks);
  }



  /**  TODO
  * Adds specified task into db complete task collection.
  * Once the addition of the task has been confirmed, removes
  * same task from active task array, both locally and in the db.
  */
  sendTaskToDb(instantId, task, callback, errorHandler){


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

};


//----------------------Options manipulation methods --------------------------//

/*
* Updates the local active task list inserting all received
* new tasks ordered by their dueTo date.
 */
function addTasksToLocalOptions(tasks) {
  $.each(tasks, function( index, task ) {
    task.generateInstantId();
    task.resetStatus();
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
