/*jshint esversion: 6 */
const OPTIONS = require('./../../optionHandler/OptionHandler');
const ListView = require('./../../lists/list');
const CompleteProjectListItem = require('./comProjectListItem');

/**
 * Represents a list of projects with methods
 * for displaying the list, applying events to
 * the list items and others.
*/

module.exports = class CompleteProjectListView extends ListView{
  constructor(projMethods){
    super();
    // Methods like project remove, or edit that will be
    // passed all the way down to the context menu btns.
    this.projMethods = projMethods;
    this.refreshMethod = projMethods.refreshPage;
    this.listSize = 30;
  }


  /**
   * Returns a list container populated with all
   * the projects stored in the user options.
   */
  getList(callback, pageNumber){
    //Secures that the list container (jquery dom) is empty.
    this.listContainer.empty();

    let promisedProjects = OPTIONS.projects.getCompleteProjects(pageNumber, this.listSize);

    promisedProjects.done((data) => {
      OPTIONS.projects.completeProjects = data.projects;
      this.list = loadListItemsInto(this, data.projects);
      this.pagbtns = this.loadPagingButtons(data.pages, pageNumber);
      if (callback!=undefined){callback(this.list, this.pagbtns);}

    }).fail((err) => {
      console.log(err);
    });


  }
};


function loadListItemsInto(listView, projects) {

    for (let i=0; i < projects.length; i++){
      let listItem = new CompleteProjectListItem(listView.projMethods);
      listView.listContainer.append(listItem.createItem(projects[i]));
    }

  return listView.listContainer;
}
