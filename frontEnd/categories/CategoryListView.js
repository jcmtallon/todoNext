/*jshint esversion: 6 */
const OPTIONS = require('./../optionHandler/OptionHandler');
const Icons = require('./../icons/icons.js');
const CategorySwipe = require('./CategorySwipe');

let Swipe;

/**
 * TODO:
 */

class CategoryListView{
  constructor(){}


  /**
   * Retrieves saved categories from user option object,
   * and appends them to the categoy list container.
   */
  displayCategories(containerId){
    appendCategories(containerId);
    applySlip(containerId);
  }

  /**
   * Same as above method but adds a fade in animation
   * to the display of the list.
   */
  displayCategoriesWithFadeIn(containerId){
    appendCategories(containerId);
    applySlip(containerId);

    let container = $('#' + containerId);
    container.hide().fadeIn(800);
  }
}



function appendCategories(containerId){
  let ol = $('#' + containerId);
  let categories = OPTIONS.Categories.getCategories();
  for (let i=0; i < categories.length; i++){
      ol.append(createListItem(categories[i]));
  }
}


function applySlip(containerId){
  Swipe = new CategorySwipe(containerId);
}


function createListItem(category){

  // Class demo-no-swipe prevents from being able
  // to slip the item.
  let listItem = $('<li>', {
    class: 'stdListItem demo-no-swipe',
    id: category.id,
    'data-title': category.title,
    'data-color': category.color,
    'data-description': category.description});
  listItem.css('background-color','rgb(255,255,255)');

  let itemTableContainer = $('<div>',{
    class:'stdListItemContainer'});
  itemTableContainer.css('padding-bottom','18px');
  listItem.append(itemTableContainer);

  let itemTable = $('<table>',{});
  itemTableContainer.append(itemTable);

  let tableBody = $('<tbody>',{});
  itemTable.append(tableBody);

  let tableRow = $('<tr>',{});
  tableBody.append(tableRow);

  let dragIconCol = $('<td>',{});
  let dragIcon = Icons.drag();
  dragIcon.addClass('std_DragBtn instant');
  dragIcon.css('padding-top','2px');
  dragIconCol.append(dragIcon);

  let catColorCol = $('<td>',{});
  catColorCol.css('padding-left','8px');
  let catColorSquare = $('<div>',{
    class:'std_catColorSquare'});
  catColorSquare.css('background-color',category.color);
  catColorCol.append(catColorSquare);

  let categoryNameCol = $('<td>',{
    class:'std_listItem_itemName',
    text: category.title});
  categoryNameCol.css('padding-left','18px');

  let infoIconCol =  $('<td>',{
    class:'hideWhenMobile'
  });
  infoIconCol.css('padding-right','9px');
  let infoIcon = Icons.info();
  infoIcon.addClass('std_menuIcon');
  infoIconCol.append(infoIcon);

  let menuCol = $('<td>',{
    class: 'std_listItem_MenuCol'});
  let menuIcon = Icons.menu();
  menuIcon.addClass('std_menuIcon');
  menuCol.append(menuIcon);

  tableRow.append(dragIconCol)
          .append(catColorCol)
          .append(categoryNameCol)
          .append(infoIconCol)
          .append(menuCol);

  if($( window ).width()>950){
    addHoverActions(listItem,[dragIcon,menuCol]);
  }

  return listItem;
}



function addHoverActions(listItem,elements){
  elements.forEach(function(element) {
    listItem.hover(e => element.animate({opacity: 1}, 0),
                   e => element.animate({opacity: 0}, 0));
  });
}


module.exports = new CategoryListView();
