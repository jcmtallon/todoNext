/*jshint esversion: 6 */
const Categories = require('./Categories.js');
const Projects = require('./Projects.js');
const ActiveTodos = require('./ActiveTodos.js');
const DbHandler = require('./../DbHandler/DbHandler');

/** @module
 *  In charge of saving all the user options (order of active
 *  todos, categories, projects, etc.) both in the browser
 *  memory and in the database.
 */

 let _OPTIONS;
 let _userId;
 let _activeTodos;
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
    // * Options structure {isFirstSession, todoList, categories, projects}
    let user = JSON.parse($('#variableJSON').text());
    $('#variableJSON').remove();

    _OPTIONS = user.options;
    _userId = user._id;

    _activeTodos = new ActiveTodos(_OPTIONS.activeTodos, _userId);
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


  get activeTodos(){
    return _activeTodos;
  }
}

 module.exports = new Options();
