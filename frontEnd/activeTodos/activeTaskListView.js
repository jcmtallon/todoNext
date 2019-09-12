/*jshint esversion: 6 */
const OPTIONS = require('./../optionHandler/OptionHandler');
const ListView = require('./../lists/list');
const icons = require('./../icons/icons.js');
const ActiveTaskListItem = require('./activeTaskListItem');
const ActiveTaskSwipe = require('./activeTaskSwipe');

/**
 * Represents a list of active tasks with methods
 * for displaying the list, applying events to
 * the list items and others.
*/

module.exports = class ActiveTaskListView extends ListView{
  constructor(taskMethods){
    super();
    // Methods like task remove, or task edit that will be
    // passed all the way down to the context menu btns.
    this.taskMethods = taskMethods;
    this.swipe = new ActiveTaskSwipe(taskMethods);
  }


  /**
   * Returns a list container populated with all
   * the active tasks stored in the user options, divided
   * into for different time periods.
   */
  getList(){
    //Secures that the list container is empty.
    this.listContainer.empty();

    let populatedList = loadListItemsInto(this.listContainer, this.taskMethods);

    // An active task list will always have at least 3 items:
    // today, tomorrow, to come.
    // If in the populatedList there are no more than 3 items,
    // we assume that the list is empty.
    let nbOfHeaders = 3;
    if (populatedList.children().length > nbOfHeaders){
      this.list = applySlipTo(populatedList, this.swipe);
      return this.list;}

    let alertMsg = 'No to do list should\nbe left empty!';
    this.list = this.buildEmptyAlert(alertMsg, icons.activeTasks);
    return this.list;
    }

    /**
     * Hightlights all those list items that now have an instant id
     * but didn't have such id in the last saved list backup.
     */
    hightlightNewItems(){

      let counter = 0;
      let lastTargetItem;
      let previousIds = OPTIONS.activeTasks.getPreviousInstantIds();

      this.list.children().each(function(){

        if ($(this).attr('data-instantId')!=undefined && !previousIds.includes($(this).attr('data-instantId'))){
          lastTargetItem = $(this);
          counter++;

          $(this).animate({backgroundColor: "#fff8e6"}, 500 )
          .animate({backgroundColor: 'white'}, 4000 );

        }

        if(counter==1){
          lastTargetItem.get(0).scrollIntoView();

          // Scroll correction to avoid that the new task shows behind the top bar.
          if(lastTargetItem[0].offsetTop < window.scrollY + 50){
            window.scrollBy(0, -200);}
            counter++;
          }
      });

    }


    /**
     * Removes list item from displayed list, and
     * updates minimization/maximization of all hedaers.
     * This method is just a cosmetic method and does not
     * modify the active task option list.
     */
    removeItemById(id){
      this.list.find('#' + id).remove();
      this.swipe.updateHeaderMargins(this.list);
    }

    /**
     * Removes list item from displayed list, and
     * updates minimization/maximization of all hedaers.
     * This method is just a cosmetic method and does not
     * modify the active task option list.
     */
    removeItemByInstantId(instantId){
      this.list.find(`[data-instantId='${instantId}']`).remove();
      this.swipe.updateHeaderMargins(this.list);
    }


};


function loadListItemsInto(list, listMethods) {
  let activeTasks = OPTIONS.activeTasks.getActiveTasks();
  let groups = divideTasksIntoGroups(activeTasks);
  let loadedList = loadGroupsIntoList(groups, list, listMethods);
  return loadedList;
}



function divideTasksIntoGroups(tasks) {

  let groups = {
      overdue : [],
      today : [],
      tomorrow : [],
      toCome : []
  };

  let today = new Date(); today.setHours(0,0,0,0);
  let tomorrow = new Date(today.valueOf()); tomorrow.setDate(today.getDate()+1);
  let afterTomorrow = new Date(today.valueOf()); afterTomorrow.setDate(today.getDate()+2);

  for (let i=0; i < tasks.length; i++){

    let dueDate = new Date(tasks[i].dueTo);

    switch (true) {
      case dueDate < today:
        groups.overdue.push(tasks[i]);
        break;

      case dueDate < tomorrow:
        groups.today.push(tasks[i]);
        break;

      case dueDate < afterTomorrow:
        groups.tomorrow.push(tasks[i]);
        break;

      default:
        groups.toCome.push(tasks[i]);
    }
  }
  return groups;
}



function loadGroupsIntoList(groups, list, listMethods) {

  let listItem;

  $.each(groups.overdue, function( index, item ){
    listItem = new ActiveTaskListItem(listMethods);
    list.append(listItem.createItem(item));
  });

  list.append(getHeader('Today', groups.overdue.length));

  $.each(groups.today, function( index, item ){
    listItem = new ActiveTaskListItem(listMethods);
    list.append(listItem.createItem(item));
  });

  list.append(getHeader('Tomorrow', groups.today.length));

  $.each(groups.tomorrow, function( index, item ){
    listItem = new ActiveTaskListItem(listMethods);
    list.append(listItem.createItem(item));
  });

  list.append(getHeader('To come', groups.tomorrow.length));

  $.each(groups.toCome, function( index, item ){
    listItem = new ActiveTaskListItem(listMethods);
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
