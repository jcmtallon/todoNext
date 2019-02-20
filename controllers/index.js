/*jshint esversion: 6 */

// Hides and displays left menu depending on screen resolution.
const leftMenuHandler = require('./menus/left_menu');

// Applies click events to top bar elements.
const topBarHandler = require('./menus/top_bar');

const Shortcuts = require('./shortcuts/shortcuts');

const TodoListController = require('./todoList/todoList_controller');

const OPTIONS = require('./optionHandler/optionHandler.js');

//Sandbox. To delete when phase 1 is ready.
const SandBox = require('./../sandBox/sandbox.js');

// Not nice, but this was the only way I found so far
// to display the content div correctly from the very
// beginning.
$('#content').css('min-height',$( window ).height()+'px');


// Generate habit tasks (if necessary) and print todo list.
// True: display list with a fadein effect.
 const TodoListMaster = new TodoListController();
 TodoListMaster.generateAndDisplayTasks(true);


$(document).ready(function(){



  //Set main page Shortcuts
  Shortcuts.setMainPageShortcuts();


});
