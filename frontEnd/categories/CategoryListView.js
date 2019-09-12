const OPTIONS = require('./../optionHandler/OptionHandler');
const CategorySwipe = require('./CategorySwipe');
const ListView = require('./../lists/list');
const CategoryListItem = require('./categoryListItem');
const icons = require('./../icons/icons.js');

/**
 * Represents a list of categories with methods
 * for displaying the list, applying events to
 * the list items and others.
*/

module.exports = class CategoryListView extends ListView{
  constructor(catMethods){
    super();
    // Methods like cat remove, or cat edit that will be
    // passed all the way down to the context menu btns.
    this.catMethods = catMethods;
  }


  /**
   * Returns a list container populated with all
   * the categories stored in the user options.
   */
  getList(){
    //Secures that the list container is empty..
    this.listContainer.empty();

    let populatedList = loadListItemsInto(this.listContainer, this.catMethods);
    if (populatedList.children().length > 0){
      this.list = applySlipTo(populatedList);
      return this.list;
    }

    let alertMsg = '';
    this.list = this.buildEmptyAlert('Divide\nand conquer!', icons.categories);
    return this.list;
    }
};


function loadListItemsInto(list, listMethods) {
  let categories = OPTIONS.categories.getCategories();
  for (let i=0; i < categories.length; i++){
      let listItem = new CategoryListItem(listMethods);
      list.append(listItem.createItem(categories[i]));
  }
  return list;
}


function applySlipTo(list){
  let swipe = new CategorySwipe();
  let listWhSwipe = swipe.applySlipTo(list);
  return listWhSwipe;
}
