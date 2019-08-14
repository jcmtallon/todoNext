/*jshint esversion: 6 */
const EventEmitter = require('events');
const Categories = require('./Categories');
const Projects = require('./Projects');
const ActiveTasks = require('./ActiveTasks');
const Habits = require('./Habits');
const Logs = require('./Logs');
const Stats = require('./Stats');
const Tasks = require('./Tasks');
const DbHandler = require('./../DbHandler/DbHandler');

/** @module
 *  In charge of saving all the user options (order of active
 *  tasks, categories, projects, etc.) both in the browser
 *  memory and in the database.
 */

 let _OPTIONS;
 let _userId;
 let _activeTasks;
 let _tasks;
 let _categories;
 let _projects;
 let _habits;
 let _logs;
 let _stats;
 let _db;

class Options extends EventEmitter{
  constructor(){
    super();
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
    _tasks = new Tasks(_userId);
    _categories = new Categories(_OPTIONS.categories, _userId);
    _projects = new Projects(_OPTIONS.projects, _userId, _categories);
    _habits = new Habits(_OPTIONS.habits, _userId);
    _logs = new Logs(_OPTIONS.logs, _userId);
    _stats = new Stats(_OPTIONS.stats, _userId);
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

  get tasks(){
    return _tasks;
  }

  get habits(){
    return _habits;
  }

  get logs(){
    return _logs;
  }

  get stats(){
    return _stats;
  }


  /**
   * Returns the deep clone of an object
   * with all the user options.
   */
  getLocalOptions(){
    let options = {
      activeTasks: _activeTasks.getActiveTasks(),
      categories : _categories.getCategories(),
      projects : _projects.getProjects(),
      habits : _habits.getHabits(),
      logs : _logs.getLogs(),
      stats : _stats.getStats()
    };
    return JSON.parse(JSON.stringify(options));
  }


  /**
   * Updates local options with passed option
   * object data.
   */
  updateLocalOptions(options){
    _activeTasks.setActiveTasks(options.activeTasks);
    _categories.setCategories(options.categories);
    _projects.setProjects(options.projects);
    _habits.setHabits(options.habits);
    _logs.setLogs(options.logs);
    _stats.setStats(options.stats);

    this.emit('updateScreen');
  }

  /**
   * Updates the database option object with
   * the local option data.
   */
  updateDb(){
    this.emit('updateScreen');
    return _db.updateOptions(_userId, {activeTasks: _activeTasks.getActiveTasks(),
                                       categories : _categories.getCategories(),
                                       projects : _projects.getProjects(),
                                       habits : _habits.getHabits(),
                                       logs : _logs.getLogs(),
                                       stats : _stats.getStats()});
    }



  /**
   * Updates complete option object in the database with
   * the specified data.
   */
  saveIntoDb(callback, errorHandler){

    const saveOptions = _db.updateOptions(_userId, {activeTasks: _activeTasks.getActiveTasks(),
                                                    categories : _categories.getCategories(),
                                                    projects : _projects.getProjects(),
                                                    habits : _habits.getHabits(),
                                                    logs : _logs.getLogs(),
                                                    stats : _stats.getStats()});

    saveOptions.done((db) => {
       _activeTasks.setActiveTasks(db.options.activeTasks);
       _categories.setCategories(db.options.categories);
       _projects.setProjects(db.options.projects);
       _habits.setHabits(db.options.habits);
       _logs.setLogs(db.options.logs);
       _stats.setStats(db.options.stats);
      if (callback != undefined){callback();}

    }).fail((err) => {
      _messanger.showMsgBox('An error occurred when saving the new data.\nPlease refresh the page and try again.','error','down');
      if (errorHandler != undefined){errorHandler();}
      console.log(err);
    });

  }
}

 module.exports = new Options();
