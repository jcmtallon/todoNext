/*jshint esversion: 6 */
const OPTIONS = require('./../optionHandler/OptionHandler');
const CategorySwipe = require('./CategorySwipe');
const ListView = require('./../lists/list');
const CategoryListItem = require('./categoryListItem');

/**
 * Represents a list of categories with methods
 * for displaying the list, applying events to
 * the list items and others.
*/

class CategoryListView extends ListView{
  constructor(){
    super();
  }


  /**
   * Returns a list container populated with all
   * the categories stored in the user options.
   */
  getList(){
    //Secures that the list container is empty.
    this.listContainer.empty();

    let populatedList = loadListItemsInto(this.listContainer);
    this.list = applySlipTo(populatedList);
    return this.list;
  }


  /**
   * Hides and applies a quick fade in effect
   * to the category list.
   */
  fadeInList(){
    this.list.hide().fadeIn(800);
  }

}


function loadListItemsInto(list) {
  let categories = OPTIONS.Categories.getCategories();
  for (let i=0; i < categories.length; i++){
      let listItem = new CategoryListItem();
      list.append(listItem.createItem(categories[i]));
  }
  return list;
}


function applySlipTo(list){
  let swipe = new CategorySwipe();
  let listWhSwipe = swipe.applySlipTo(list);
  return listWhSwipe;
}

module.exports = new CategoryListView();
