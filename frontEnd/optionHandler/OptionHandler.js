/*jshint esversion: 6 */
const Categories = require('./Categories.js');
const Projects = require('./Projects.js');
const ActiveTasks = require('./ActiveTasks.js');
const DbHandler = require('./../DbHandler/DbHandler');

/** @module
 *  In charge of saving all the user options (order of active
 *  tasks, categories, projects, etc.) both in the browser
 *  memory and in the database.
 */

 let _OPTIONS;
 let _userId;
 let _activeTasks;
 let _categories;
 let _projects;
 let _db;

class Options{
  constructor(){
    // User data and options are stored at the very end of the main view ejs file
    // inside a User object.
    // Before the user gets to see it, we retrieve the data form the ejs and
    // remove the element from the view to leave no trace.
    // * User structure {id, name, email, username, password, options}
    // * Options structure {isFirstSession, taskList, categories, projects}
    let user = JSON.parse($('#variableJSON').text());
    $('#variableJSON').remove();

    _OPTIONS = user.options;
    _userId = user._id;
    _activeTasks = new ActiveTasks(_OPTIONS.activeTasks, _userId);
    _categories = new Categories(_OPTIONS.categories, _userId);
    _projects = new Projects(_OPTIONS.projects, _userId);
    _db = new DbHandler();
  }

  get userId(){
    return _userId;
  }

  // TODO:no pasar options tal cual.
  get options(){
    return _OPTIONS;
  }

  get categories(){
    return _categories;
  }

  get projects(){
    return _projects;
  }


  get activeTasks(){
    return _activeTasks;
  }


  /**
   * Used every time the active task page is loeaded to know if
   * checking the habit objects and generating new habit tasks is
   * required or not.
   * @return {Boolean}
   */
  checkingHabitsIsNeeded(){

    if (_OPTIONS.lastHabitUpdate==undefined){
      return true;
    }

    let today = new Date();
    today.setHours(0,0,0,0);

    if (_OPTIONS.lastHabitUpdate<today){
      return true;
    }

    return false;
  }

  setLastHabitUpdate(date){
    _OPTIONS.lastHabitUpdate = date;
    const updatePromise = _db.updateOptions(_userId, {lastHabitUpdate: date});

    updatePromise.done((options) => {})
                 .fail((err) => {
      _messanger.showMsgBox('An error occurred when updating habit data.\nPlease refresh the page and try again.','error','down');
      console.log(err);
    });
  }
}

 module.exports = new Options();
