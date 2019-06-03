/*jshint esversion: 6 */
const Todo = require('./Todo');
const OPTIONS = require('./../optionHandler/OptionHandler');
const MsgBox = require('./../messageBox/messageBox');
const moment = require('moment');

/**
 * Using the public script slip, addes the slip(swipe)
 * functionality as well as the related slip action events.
 */

let list;
let direction;
let pageMethods;
let messenger = new MsgBox();

module.exports = class ActiveTodoSwipe{
  constructor(methods){
    pageMethods = methods;
  }


  applySlipTo(jqueryList){
    // Slip only works with native dom elements.
    // That is why we get the native dom from the jquery
    // object first.
    list = jqueryList[ 0 ];

    // Add slip events
    preventReorderingTitles();
    setDirectionRecorder();
    setTodoColorizer();
    setCancelTodoAction();
    preventSwippingTitles();
    enableTaskReorder();
    addSwipeActions();
    addReorderEvent();

    new Slip(list);
    return $(list);
  }


  /**
   * Addapts the header top margins to the new
   * state of the list.
   */
  updateHeaderMargins(list){
    updateHeaderMargins(list);
  }
};


/**
 * Items with the class /demo-no-reorder/cannot be
 * reordered in the list.
 */
function preventReorderingTitles(){

  list.addEventListener('slip:beforereorder', function(e){
      if (/demo-no-reorder/.test(e.target.className)) {
          e.preventDefault();
      }
  }, false);

}



/**
 * Saves the direction of the swipe.
 */
function setDirectionRecorder() {
  list.addEventListener('slip:swipe', (e) =>{
    direction = e.detail.direction;
    // this._index = e.detail.originalIndex;
  },false);
}


/**
 * Changes the todo task color to green or red depending the direction.
 */
function setTodoColorizer() {
  list.addEventListener('slip:animateswipe',function(e){
    if(e.detail.x>0){
        e.target.style.opacity  = 1-(e.detail.x/600);
        e.target.style.backgroundColor = 'rgb(' + [255-((e.detail.x*10)/300),255,255-((e.detail.x*10)/300)].join(',') +')';
    }else{
        e.target.style.opacity  = 1-(-e.detail.x/600);
        e.target.style.backgroundColor = 'rgb(' + [255,255-((-e.detail.x*10)/200),255-((-e.detail.x*10)/200)].join(',') +')';
    }
  });
}


/**
 * If for some reason, the swipe gets cancelled, the todo item goes back to
 *  its original opacity and color values.
 */
function setCancelTodoAction(){

  list.addEventListener('slip:cancelswipe',function(e){
    e.target.style.opacity  = 1;
    e.target.style.backgroundColor = 'rgb(255,255,255)';
  });
}


/**
 * Li items with the class /demo-no-swipe/ cannot be
 * swipped in the list.
 */
function preventSwippingTitles(){
  list.addEventListener('slip:beforeswipe', function(e){
      if (e.target.nodeName == 'INPUT' || /demo-no-swipe/.test(e.target.className)) {
          e.preventDefault();
      }
  }, false);
}


/**
 * Enables the reorder functionality.
 */
function enableTaskReorder(){
  list.addEventListener('slip:beforewait', function(e){

    // When the event target is an embedded svg, the className
    // does not return a string but an object. To prevent this
    // method from failing trying to retrieve the clas information,
    // we use typeof first to distinguish the type of element.

    if(typeof e.target.className == 'string'){
      if (e.target.className.indexOf('instant') > -1){
        e.preventDefault();
      }
    }else{
      if (e.target.className.animVal.indexOf('instant') > -1){
        e.preventDefault();
      }
    }

  }, false);
}


/**
 * Execute the following actions when todos are swipped:
 *  Left: Removes task from active todo list.
 *  Right: Saves task into complete task db col and generates corresponding points. .
 */
function addSwipeActions() {

  this.addEventListener('slip:afterswipe', (e) =>{

    // If no connection refresh page and show error message.
    if (!navigator.onLine){
      pageMethods.showPage();
      messenger.showMsgBox('Failed to update task\ndue to connection issues.\nCheck your internet connection\nand refresh the page.','error','down');
    }

    let todoId = e.target.id;
    let todoList = e.target.parentNode;

    // Either directions, remove object from list and adjust minimization.
    todoList.removeChild(e.target);
    updateHeaderMargins($(todoList));

    // Remove from option task list. Refresh page if fails.
    if(direction == 'left'){
      OPTIONS.activeTodos.removeActiveTodoById(todoId, null, pageMethods.showPage);
    }

    // Move from option task list to complete task db col.
    if(direction == 'right'){
      let callback = () => {
        console.log('SAVED!');
      };
      let todo = OPTIONS.activeTodos.getTodoById(todoId);
      todo.userId = OPTIONS.userId;
      let completeTodo = todo.getCompleteTodo();
      OPTIONS.activeTodos.sendTodoToDb(completeTodo, callback, pageMethods.showPage);
    }

  }, false);
}


/**
 * Remembers list item new position and saves the whole
 * list data back into the OPTIONS object.
 */
function addReorderEvent(){

  list.addEventListener('slip:reorder', (e)=>{
      e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);

      let prevIndex = e.detail.originalIndex;
      let newIndex = e.detail.spliceIndex;

      // If item position does not change, do nothing.
      if(prevIndex == newIndex){
        return false;
      }

      // If no connection refresh page and show error message.
      if (!navigator.onLine){
        pageMethods.showPage();
        messenger.showMsgBox('Failed to save the changes\ndue to connection issues.\nCheck your internet connection\nand refresh the page.','error','down');
      }

      // Cache list view
      let todoList = e.currentTarget;

      updateItemDate(todoList, newIndex);
      updateHeaderMargins($(todoList));
      saveActiveTodos();
      return false;
  }, false);
}


function updateItemDate(todoList, newIndex) {

  // Generate new date
  let newDate = generateNewDate(todoList, newIndex);
  let newDueTo = moment(newDate).format('MMM D');


  // Grab target list item.
  let targetTodo = $(todoList.children[newIndex]);
  let id = targetTodo.attr('id');

  // Update attribute and dueTo column.
  targetTodo.attr('data-dueTo',newDate);
  let dueToCol = $('#'+id + ' .activeTask_deadlineCol');
  setTimeout( () => {
    dueToCol.fadeOut(500);
    setTimeout( () => {
      dueToCol.text(newDueTo).fadeIn(500);
    }, 500);
  }, 800);
}



function generateNewDate(todoList, newIndex) {

  let newDate = new Date();

  let prevTodo = $(todoList.children[newIndex-1]);
  let targetTodo = $(todoList.children[newIndex]);
  let nextTodo = $(todoList.children[newIndex+1]);


  // If todo became the first item of the list
  // if previos element is Today header, gets Today-1day, else gets the same
  // date as the previos todo.
  if(newIndex==0){
    if(nextTodo.text() == 'Today'){
      return new Date(newDate.setDate(newDate.getDate()-1));
    }
    return new Date(nextTodo.attr('data-dueTo'));

  // If previos list item is a header, gets the header date.
  }else if (prevTodo.text() == 'Today'){
    return newDate;
  }else if (prevTodo.text() == 'Tomorrow'){
    return new Date(newDate.setDate(newDate.getDate()+1));
  }else if (prevTodo.text() == 'To come'){
    return new Date(newDate.setDate(newDate.getDate()+2));

  // If next item in list is a todo, takes the date from it.
  }else if (todoList.length > newIndex+1 && nextTodo.id!=''){
    return new Date(nextTodo.attr('data-dueTo'));

  // Else we assume that there is a todo right on top and we take the data from it.
  }else{
    return new Date(prevTodo.attr('data-dueTo'));
  }
}


function updateHeaderMargins(list) {

  let index = 0;
  let thisIsHeader = false;
  let prevIsHeader = false;

  list.find('li').each(function(){

    thisIsHeader = (this.id=='') ? true : false;
    if (index == 0 && thisIsHeader){this.style.marginTop='30px';}
    if (prevIsHeader && thisIsHeader){this.style.marginTop='30px';}
    if (index > 0 && !prevIsHeader && thisIsHeader){this.style.marginTop='95px';}
    prevIsHeader = thisIsHeader;
    index++;
   });
}

/**
 * Retrieves all category data back from the UI list and sends back an
 * array with all the categories to the database.
 */
function saveActiveTodos(){

  let todoArray = [];

  $(list).find('li').each(function(idx, li) {

    // Headers have no id and shoud not be added to the todo array.
    if (li.id == ''){return true;}

    let todo = new Todo();
    todo.id = li.id;
    todo.title = li.getAttribute('data-title');
    todo.dueTo = li.getAttribute('data-dueTo');
    todo.urgency = li.getAttribute('data-urgency');
    todo.hours = li.getAttribute('data-hours');
    todo.progress = li.getAttribute('data-progress');
    todo.isLearning = li.getAttribute('data-isLearning');
    todo.status = li.getAttribute('data-status');
    todo.categoryId = li.getAttribute('data-categoryId');
    todo.projectId = li.getAttribute('data-projectId');
    todo.habitId = li.getAttribute('data-habitId');
    todo.notes = li.getAttribute('data-notes');

    todoArray.push(todo.todoToDbObject());

  });

  OPTIONS.activeTodos.saveActiveTodos(todoArray);

}
