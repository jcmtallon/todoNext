/*jshint esversion: 6 */
const OPTIONS = require('./../optionHandler/OptionHandler');
const ListView = require('./../lists/list');
const icons = require('./../icons/icons.js');
const ActiveTodoListItem = require('./activeTodoListItem');
const ActiveTodoSwipe = require('./ActiveTodoSwipe');

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
    this.swipe = new ActiveTodoSwipe(todoMethods);
  }


  /**
   * Returns a list container populated with all
   * the active todos stored in the user options, divided
   * into for different time periods.
   */
  getList(){
    //Secures that the list container is empty.
    this.listContainer.empty();

    let populatedList = loadListItemsInto(this.listContainer, this.todoMethods);

    if (populatedList.children().length > 0){
      this.list = applySlipTo(populatedList, this.swipe);
      return this.list;}

    let alertMsg = 'No to do list should\nbe left empty!';
    this.list = this.buildEmptyAlert(alertMsg, icons.activeTodos);
    return this.list;
    }


    /**
     *
     */
    hightlightNewItems(){

      let counter = 0;
      let lastTargetItem;
      let previousIds = OPTIONS.activeTodos.getPreviousIds();

      this.list.children().each(function(){

        if ($(this).attr('id')!=undefined && !previousIds.includes($(this).attr('id'))){
          lastTargetItem = $(this);
          counter++;

          $(this).animate({backgroundColor: "#fff4bf"}, 500 )
          .animate({backgroundColor: 'white'}, 4000 );

        }

        if(counter==1){
          lastTargetItem.get(0).scrollIntoView();
          // Scroll correction to avoid that the new task shows behind the top bar.
          if(window.scrollY != (document.body.offsetHeight-window.innerHeight)){
            window.scrollBy(0, -200);}
          }

      });

    }


    /**
     * Removes list item from displayed list, and
     * updates minimization/maximization of all hedaers.
     * This method is just a cosmetic method and does not
     * modify the active todo option list.
     */
    removeItemById(id){
      this.list.find('#' + id).remove();
      this.swipe.updateHeaderMargins(this.list);
    }
};


function loadListItemsInto(list, listMethods) {
  let activeTodos = OPTIONS.activeTodos.getActiveTodos();
  let groups = divideTodosIntoGroups(activeTodos);
  let loadedList = loadGroupsIntoList(groups, list, listMethods);
  return loadedList;
}



function divideTodosIntoGroups(todos) {

  let groups = {
      overdue : [],
      today : [],
      tomorrow : [],
      toCome : []
  };

  let today = new Date(); today.setHours(0,0,0,0);
  let tomorrow = new Date(today.valueOf()); tomorrow.setDate(today.getDate()+1);
  let afterTomorrow = new Date(today.valueOf()); afterTomorrow.setDate(today.getDate()+2);

  for (let i=0; i < todos.length; i++){

    dueDate = new Date(todos[i].dueTo);

    switch (true) {
      case dueDate < today:
        groups.overdue.push(todos[i]);
        break;

      case dueDate < tomorrow:
        groups.today.push(todos[i]);
        break;

      case dueDate < afterTomorrow:
        groups.tomorrow.push(todos[i]);
        break;

      default:
        groups.toCome.push(todos[i]);
    }
  }
  return groups;
}



function loadGroupsIntoList(groups, list, listMethods) {

  let listItem;

  $.each(groups.overdue, function( index, item ){
    listItem = new ActiveTodoListItem(listMethods);
    list.append(listItem.createItem(item));
  });

  list.append(getHeader('Today', groups.overdue.length));

  $.each(groups.today, function( index, item ){
    listItem = new ActiveTodoListItem(listMethods);
    list.append(listItem.createItem(item));
  });

  list.append(getHeader('Tomorrow', groups.today.length));

  $.each(groups.tomorrow, function( index, item ){
    listItem = new ActiveTodoListItem(listMethods);
    list.append(listItem.createItem(item));
  });

  list.append(getHeader('To come', groups.tomorrow.length));

  $.each(groups.toCome, function( index, item ){
    listItem = new ActiveTodoListItem(listMethods);
    list.append(listItem.createItem(item));
  });

  return list;

}


function getHeader(title, prevGroupItemNb) {

  let header = $('<li>',{
    class: 'demo-no-reorder demo-no-swipe list_header',
    text: title
  });

  let reduceTopMargin;
  reduceTopMargin = (prevGroupItemNb == 0) ? true : false;

  if (reduceTopMargin){
    header.css('margin-top','30px');
  }
  return header;
}





function applySlipTo(list, swipe){
  let listWhSwipe = swipe.applySlipTo(list);
  return listWhSwipe;
}
