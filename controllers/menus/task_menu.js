/*jshint esversion: 6 */

const Shortcuts = require('./../shortcuts/shortcuts');
const ProgressForm = require('./../forms/add_progress_form');

let listController;
let swipeController;
let todo;
let thisMenu;


//Menu buttons
let options = {
  edit:{
    text: 'Edit',
    src: '/assets/icon_edit.svg',
    sepparator: true,
    fun: (todo) => {
      alert('Edit. Cooming soon');
      console.log(todo);
    }
  },
  pending:{
    text: 'Pending',
    src: '/assets/btn_pending_grey.svg',
    sepparator: false,
    fun: (todo) => {
      alert('Pending. Cooming soon');
      console.log(todo);
    }
  },
  remove:{
    text: 'Remove',
    src: '/assets/icon_delete.svg',
    sepparator: false,
    fun: (todo) => {
      alert('Remove. Cooming soon');
      console.log(todo);
    }
  },
  progress:{
    text: 'Progress',
    src: '/assets/icon_hours_grey.svg',
    sepparator: true,
    fun: (todo) => {
      closeTaskMenu();
      let progressForm = new ProgressForm(listController, swipeController);
      progressForm.displayForm(todo);
    }
  },
};



module.exports = class TaskMenu{
  constructor(listControl, currentTodo, swipeControl){

    listController = listControl;
    todo = currentTodo;
    swipeController = swipeControl;
  }






  /**
   * displayTaskMenu - Loads elegible buttons, print menu,
   * set a different background for the current task
   * and set the different menu closing methods.
   *
   * @param  {type} elm description
   * @return {type}     description
   */
  displayTaskMenu(elm){

    // Disable main page shortcuts.
    Shortcuts.removeMainPageShortctus();

    // Load menu bottons.
    let options = ['edit','pending', 'remove'];
    if(todo.hours!='Score'){options.unshift('progress');}

    // Build menu with the passed options.
    $(document.body).append(buildMenu(options, elm));

    //Hightlights selected list todo.
    $(`#${todo._id}`).css('background-color','#f7f9fc');

    // Closes menu when clicking outside.
    setCloseEvents();

  }
};



/**
 * buildMenu - Builds and returns menu inside a jquery element.
 * @private
 * @param  {Object} options global variable inside this module
 * @param {jquery}  jquery element that triggered the action.
 * @return {$}      jquery dom element.
 */
function buildMenu(options, elm){

  // Div for setting menu position
  thisMenu = $('<div>', {
    class:'task_menu_floater',
    id:'task_menu_floater',
  });

  // First visible element
  let innerHolder = $('<div>',{
    class:'task_menu_innerHolder'});

  let menuTable = $('<table>',{
    class:'task_menu_table'});

  let optTbody = $('<tbody>',{});

  $.each( options, ( index, option ) => {
    optTbody.append(buildMenuRow(option));
  });

  // Menu Assemble!
  menuTable.append(optTbody);
  innerHolder.append(menuTable);
  thisMenu.append(innerHolder);

  // Get icon position
  let leftPos = elm.offset().left;
  let topPos = elm.offset().top;

  // Adjust left value if menu goes out of the screen.
  // 185 is the width of the contextmenu.
  if ((leftPos + 185 ) > $( window ).width()){

    //33 is added to align the menu to the right side of
    // the icon.
    leftPos = leftPos - 185 + 33;
  }

  // Apply values.
  thisMenu.css({top:topPos + 32, left: leftPos + 13});

  return thisMenu;

}


/**
 * buildMenuRow - Builds and returns row for passed menu option.
 * Due to my severe lazyness, this method reuses the same classes
 * as the drop down menu from the add new task modal.
 *
 * @param  {Object} option ex:{text: '',src: '', sepparator: false, fun: ()
 * @return {$}       jquery dom element.
 */
function buildMenuRow(optionName) {

  let option = options[optionName];

  //Option icon

  let rowIcon = $('<img>',{
    class:'addTask_tableOption_icon',
    src: option.src});

  let leftPart = $('<div>',{
    class:'addTask_tableOption_leftPart'});
  leftPart.append(rowIcon);

  //Option text

  let rightPart = $('<div>',{
    class:'addTask_tableOption_rightPart',
    text: option.text});

  //Option containers

  let emptyDiv = $('<div>');
  emptyDiv.css('display','flex');
  emptyDiv.css('align-items','center');
  emptyDiv.append(leftPart).append(rightPart);

  let optTbCol = $('<td>',{
    class:'addTask_tableOption'});
  optTbCol.append(emptyDiv);

  let optTbRow = $('<tr>');

  optTbRow.append(optTbCol);

  // Add on click event

  optTbRow.click( () => {
    option.fun(todo);
  });

  // Add mouseover event
  optTbRow.mouseenter(()=>{optTbRow.css('background-color','#ededed');});
  optTbRow.mouseleave(()=>{optTbRow.css('background-color','white');});

  return optTbRow;
}



/**
 * @private
 * setCloseEvents - Adds click event so the menu is removed from
 * the screen when the user clicks outside the menu.
 */
function setCloseEvents() {


  // Close menu when clicking outside.
  $(document).click((e) =>{
    if(e.target != thisMenu ){
      closeTaskMenu();
      restoreShortcuts();
    }
  });

  // Close menu when clicking escape key.
  // (we remove keydowns before to avoid possible duplicates)
  $(document).off('keydown');
  $(document).keydown((e) => {
    if (e.keyCode == 27) {
      closeTaskMenu();
      restoreShortcuts();}
  });

}

/**
 * @private
 * closeTaskMenu - Removes menu from screen and sets original shortcuts.
 */
function closeTaskMenu(){

  thisMenu.remove();
  $(`#${todo._id}`).css('background-color','white');
  $(document).off('click');

}


/**
 * restoreShortcuts - Set main page shortcuts.
 *  (Remove first to avoid any possible duplicates. )
 * @return {type}  description
 */
function restoreShortcuts(){
  Shortcuts.removeMainPageShortctus();
  Shortcuts.setMainPageShortcuts();
}
