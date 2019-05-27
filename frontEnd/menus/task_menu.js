/*jshint esversion: 6 */

const Shortcuts = require('./../shortcuts/shortcuts');
const ProgressForm = require('./../forms/add_progress_form');
const NotesForm = require('./../forms/add_note_form');
const Icons = require('./../icons/icons.js');
const OPTIONS = require('./../optionHandler/OptionHandler.js');


let listController;
let swipeController;
let todo;
let thisMenu;


//Menu buttons
let options = {
  edit:{
    text: 'Edit',
    src: Icons.edit(),
    fun: (todo) => {
      alert('Edit. Cooming soon');
      console.log(todo);
    }
  },
  pending:{
    text: 'Pending',
    src: Icons.pending(),
    fun: (todo) => {
      closeTaskMenu();
      listController.updateTaskProgress(todo._id, {status:'pending'});
      OPTIONS.ActiveTodos.removeTodoById(todo._id);

      // Removes object and minimizes list header if went empty.
      swipeController.minimize(todo._id);
      }
  },
  remove:{
    text: 'Remove',
    src: Icons.delete(),
    fun: (todo) => {
      closeTaskMenu();
      listController.removeTodoFromDb(todo._id);

      // Removes object and minimizes list header if went empty.
      swipeController.minimize(todo._id);

    }
  },
  progress:{
    text: 'Progress',
    src: Icons.progress(),
    fun: (todo) => {
      closeTaskMenu();
      let progressForm = new ProgressForm(listController, swipeController);
      progressForm.displayForm(todo);
    }
  },
  notes:{
    text: 'Notes',
    src: Icons.notes(),
    fun: (todo) => {
      closeTaskMenu();
      let NotesF = new NotesForm(listController);
      NotesF.displayForm(todo);
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
    Shortcuts.removeAllGlobalShortcuts();

    // Load menu bottons.
    let options = ['notes', 'edit','pending', 'remove'];
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
    class:'contextMenu_floater',
    id:'contextMenu_floater',
  });

  // First visible element
  let innerHolder = $('<div>',{
    class:'contextMenu_innerHolder'});

  let menuTable = $('<table>',{
    class:'contextMenu_table'});

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
 * @param  {Object} option ex:{text: '',src: '', fun: ()
 * @return {$}       jquery dom element.
 */
function buildMenuRow(optionName) {

  let option = options[optionName];

  //Option icon
  let rowIcon = option.src;
  rowIcon.addClass('addTask_tableOption_icon');


  let leftPart = $('<div>',{
    class:'ddm_menu_rowLeftCol'});
  leftPart.append(rowIcon);

  //Option text

  let rightPart = $('<div>',{
    class:'ddm_menu_rowRightCol',
    text: option.text});

  //Option containers

  let emptyDiv = $('<div>');
  emptyDiv.css('display','flex');
  emptyDiv.css('align-items','center');
  emptyDiv.append(leftPart).append(rightPart);

  let optTbCol = $('<td>',{
    class:'ddm_menu_rowColumn'});
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
  Shortcuts.removeAllGlobalShortcuts();
  Shortcuts.setAllGlobalShortcuts();
}
