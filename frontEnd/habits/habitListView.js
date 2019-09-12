/*jshint esversion: 6 */
const OPTIONS = require('./../optionHandler/OptionHandler');
const ListView = require('./../lists/list');
const HabitListItem = require('./habitListItem');
const icons = require('./../icons/icons.js');

/**
 * Represents a list of habits with methods
 * for displaying the list, applying events to
 * the list items and others.
*/

module.exports = class HabitListView extends ListView{
  constructor(habMethods){
    super();
    // Methods like habit remove, or habit edit that will be
    // passed all the way down to the context menu btns.
    this.habMethods = habMethods;
  }


  /**
   * Returns a list container populated with all
   * the habits stored in the user options.
   */
  getList(){
    //Secures that the list container is empty
    // to avoid generating possible duplicates.
    this.listContainer.empty();

    this.list = loadListItemsInto(this.listContainer, this.habMethods);
    if (this.list.children().length > 0){
      return this.list;
    }

    let alertMsg = '';
    this.list = this.buildEmptyAlert('Motivation gets you started,\nhabits keep you going!', icons.habits);
    return this.list;
    }


    /**
     * Removes list item from displayed list, and
     * updates minimization/maximization of all hedaers.
     * This method is just a cosmetic method and does not
     * modify the active task option list.
     */
    removeItemById(id){
      this.list.find('#' + id).remove();
    }
};


function loadListItemsInto(list, listMethods) {
  let habits = OPTIONS.habits.getHabits();
  for (let i=0; i < habits.length; i++){
      let listItem = new HabitListItem(listMethods);
      list.append(listItem.createItem(habits[i]));
  }
  return list;
}
