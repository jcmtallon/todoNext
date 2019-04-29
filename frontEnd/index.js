/*jshint esversion: 6 */

const leftMenu = require('./screens/leftMenu/leftMenu');
leftMenu.setMenuEvents();

// Applies click events to top bar elements.
const topBarHandler = require('./menus/top_bar');

const shortcuts = require('./shortcuts/shortcuts');

const TodoListController = require('./todoList/todoList_controller');

const OPTIONS = require('./optionHandler/OptionHandler.js');

//Sandbox. To delete when phase 1 is ready.
const sandBox = require('./../sandBox/sandbox.js');

// Not nice, but this was the only way I found so far
// to display the content div correctly from the very
// beginning.
$('#content').css('min-height',$( window ).height()+'px');


// Generate habit tasks (if necessary) and print todo list.
// True: display list with a fadein effect.
 const todoListMaster = new TodoListController();
 todoListMaster.generateAndDisplayTasks(true);


$(document).ready(function(){
  //Set main page Shortcuts
  shortcuts.setMainPageShortcuts();
});
