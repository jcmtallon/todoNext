/*jshint esversion: 6 */
const addTaksForm = require('./forms/add_task_form');
const leftMenuHandler = require('./menus/left_menu');
const Hint = require('./hints/help_hint');
const Shortcuts = require('./shortcuts/shortcuts');
const SandBox = require('./../sandBox/sandbox.js');
const TodoListController = require('./todoList/todoList_controller');


// Generate habit tasks (if necessary) and print todo list.
// True: display list with a fadein effect.
const TodoListMaster = new TodoListController();
TodoListMaster.generateAndDisplayTasks(true);


$(document).ready(function(){

  //User interface elements
  const leftMenuIconHolder = $('#top_bar_menu_icon_container');
  const leftMenu = $("#left_menu");
  const content = $("#content");
  const leftMenuIcon = $("#top_bar_menu_icon");


  //Shows and hides left menu in mobile version.
  leftMenuIconHolder.on('click', function(){
    if ($( window ).width()<950){
      if(leftMenu.hasClass("show_left_menu")){
        leftMenuHandler.leftMenuHide(leftMenu,content,leftMenuIcon);
      }else{
        leftMenuHandler.leftMenuShow(content,leftMenu,leftMenuIcon);
      }
    }
  });


  //Removes mobile left menu when screen is enlarged to PC size.
  $( window ).resize(function() {
   if($( window ).width()>950 &&  leftMenu.hasClass("show_left_menu")){
     leftMenuHandler.leftMenuHide(leftMenu,content,leftMenuIcon);
   }
});

  //Adapts content div size to the size of the window
  $('#content').css('min-height', $( window ).height()-50);


  //Displays add task form
  $('#top_bar_add_btn_container').on('click', function(){
      addTaksForm.showModal();
  });


  //Displays hint when user hovers elements with hints attached.
  const MainHints = new Hint('.hintHolder');


  //Set main page Shortcuts
  const MainPageShortcuts = new Shortcuts();
  MainPageShortcuts.setMainPageShortcuts();


  //Add date to top bar
  const todaysDate = new Date();
  function short_month(dt){
    let shortMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return shortMonths[dt.getMonth()];}
  const todaysDateString = short_month(todaysDate) + ' ' + todaysDate.getDate() + ', ' + todaysDate.getFullYear();
  $('#top_bar_center').text(todaysDateString);

  //For testing purposes
  const Sb = new SandBox();

  $('#filter_container').on('click', function(){
      Sb.checkDays();
  });


});
