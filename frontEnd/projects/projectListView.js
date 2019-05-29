/*jshint esversion: 6 */
const OPTIONS = require('./../optionHandler/OptionHandler');
const ProjectSwipe = require('./projectSwipe');
const ListView = require('./../lists/list');
const ProjectListItem = require('./projectListItem');
const icons = require('./../icons/icons.js');

/**
 * Represents a list of projects with methods
 * for displaying the list, applying events to
 * the list items and others.
*/

module.exports = class ProjectListView extends ListView{
  constructor(projMethods){
    super();
    // Methods like project remove, or edit that will be
    // passed all the way down to the context menu btns.
    this.projMethods = projMethods;
  }


  /**
   * Returns a list container populated with all
   * the projects stored in the user options.
   * If no projects available, restores a message
   * to the user with an image.
   */
  getList(){
    //Secures that the list container (jquery dom) is empty.
    this.listContainer.empty();

    let populatedList = loadListItemsInto(this.listContainer, this.projMethods);
    if (populatedList.children().length > 0){
      this.list = applySlipTo(populatedList);
      return this.list;
    }

    let alertMsg = 'The next big\nchallenge awaits!';
    this.list = this.buildEmptyAlert(alertMsg, icons.projects);
    return this.list;
  }
};


function loadListItemsInto(list, listMethods) {
  let projects = OPTIONS.projects.getProjects();
  for (let i=0; i < projects.length; i++){
      let listItem = new ProjectListItem(listMethods);
      list.append(listItem.createItem(projects[i]));
  }
  return list;
}


function applySlipTo(list){
  let swipe = new ProjectSwipe();
  let listWhSwipe = swipe.applySlipTo(list);
  return listWhSwipe;
}
