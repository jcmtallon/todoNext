/*jshint esversion: 6 */
const OPTIONS = require('./../optionHandler/OptionHandler');
const ListView = require('./../lists/list');
const icons = require('./../icons/icons.js');
const ActiveTodoListItem = require('./activeTodoListItem');
// const CategorySwipe = require('./CategorySwipe');

/**
 * Represents a list of active todos with methods
 * for displaying the list, applying events to
 * the list items and others.
*/

module.exports = class ActiveTodoListView extends ListView{
  constructor(todoMethods){
    super();
    // Methods like todo remove, or todo edit that will be
    // passed all the way down to the context menu btns.
    this.todoMethods = todoMethods;
  }


  /**
   * Returns a list container populated with all
   * the active todos stored in the user options.
   */
  getList(){ //TODO: addapt to active Todo needs!!!!!!
    //Secures that the list container is empty.
    this.listContainer.empty();

    let populatedList = loadListItemsInto(this.listContainer, this.todoMethods);

    if (populatedList.children().length > 0){
      this.list = applySlipTo(populatedList);
      return this.list;}

    let alertMsg = 'No to do list should\nbe left empty!';
    this.list = this.buildEmptyAlert(alertMsg, icons.activeTodos);
    return this.list;
    }
};


function loadListItemsInto(list, listMethods) {
  let activeTodos = OPTIONS.activeTodos.getActiveTodos();

  for (let i=0; i < activeTodos.length; i++){
      let listItem = new ActiveTodoListItem(listMethods);
      list.append(listItem.createItem(activeTodos[i]));}
  return list;
}


function applySlipTo(list){
  // let swipe = new CategorySwipe();
  // let listWhSwipe = swipe.applySlipTo(list);
  // return listWhSwipe;
  return list;
}
