/*jshint esversion: 6 */
const Category = require('./Category');
const OPTIONS = require('./../optionHandler/OptionHandler');

/**
 * Using the public script slip, addes the slip(swipe)
 * functionality as well as the related slip action events.
 */

let list;

module.exports = class CategorySwipe{

  constructor(){
  }


  /**
   *
   */
  applySlipTo(jqueryList){
    // Slip only works with native dom elements.
    // That is why we get the native dom from the jquery
    // object first.
    list = jqueryList[ 0 ];

    preventSwipe();
    enableReorder();
    addReorderEvent();

    new Slip(list);
    return $(list);
  }

};


/**
 * Li items with the class /demo-no-swipe/ cannot be
 * swipped in the list.
 */
function preventSwipe(){
  list.addEventListener('slip:beforeswipe', function(e){
    let listItem = e.target.closest("ol > li");
      if (/demo-no-swipe/.test(listItem.className)) {
          e.preventDefault();
      }
  }, false);
}


/**
 * Enables the reorder functionality.
 */
function enableReorder(){
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
 * Remembers list item new position and saves the whole
 * list data back into the OPTIONS object.
 *
 */
function addReorderEvent(){

  list.addEventListener('slip:reorder', (e)=>{
      e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
      saveCategories();
      return false;
  }, false);
}


/**
 * Retrieves all category data back from the UI list and sends back an
 * array with all the categories to the database.
 */
function saveCategories(){

  let categoryArray = [];

  $(list).find('li').each(function(idx, li) {

    let cat = new Category();
    cat.id = li.id;
    cat.title = li.getAttribute('data-title');
    cat.color = li.getAttribute('data-color');
    cat.description = li.getAttribute('data-description');
    cat.completedTaskNb = li.getAttribute('data-doneTask');
    cat.totalTaskNb = li.getAttribute('data-totalTask');

    categoryArray.push(cat.categoryToDbObject());

  });

  OPTIONS.categories.saveCategories(categoryArray);

}
