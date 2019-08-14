const OPTIONS = require('./../optionHandler/OptionHandler');
const ListView = require('./../lists/list');
const TaskListItem = require('./TaskListItem');
const loader = require('./../otherMethods/Loader');
const icons = require('./../icons/icons.js');

/**
 * Represents a list of tasks that the user can filtered
 * using different condition selectors and a search button.
 * TODO: detailed explanation
*/
module.exports = class FilteredTaskListView extends ListView{
  constructor(pageMethods){
    super();

    this.pageMethods = pageMethods;
    this.listSize = 20;
  }

  /**
   * Fetches a list with tasks that matches the conditions specified
   * in the passed query.
   *
   * @param  {Object} query = {pageNb: 1}
   * @return {Jquery}  List view object
   */
  async getList(query = {pageNb: 1}){

    try {

      loader.displayLoader();

      this.listContainer.empty();
      query.size =   this.listSize;

      // Retrieve active tasks from local options.
      let actTaskObj = OPTIONS.activeTasks.getTasksByQuery(query);

      // Calculate the number of remaining "slots" in the page, after
      // having retrieved the active tasks, and update the query so
      // only that number of tasks are retrieved from the db.
      let remainingSlots = this.listSize - actTaskObj.tasks.length;
      query.size = remainingSlots;

      // Calculate the number of tasks that need to be skipped
      // in the db request.
      let skip = ((query.pageNb - 1) * this.listSize) - actTaskObj.totalCount;
      query.skip = (skip<0) ? 0 : skip;

      // Retrieve db tasks.
      let dbTaskObj = await OPTIONS.tasks.getTasksByQuery(query);

      // Calculate number of pages.
      let totalTaskCnt = actTaskObj.totalCount + dbTaskObj.totalCount;
      this.pageCnt = Math.ceil(totalTaskCnt / this.listSize);

      // Places pending tasks first in the array (if there are);
      let sortedTasks = this._sortCompleteTasks(dbTaskObj.tasks);

      // Contact both task lists and render.
      let tasks = actTaskObj.tasks.concat(sortedTasks);
      this.list = this._loadListItems(tasks);

      loader.removeLoader();

      return this.list;

    } catch (e) {
      console.log(e);
      this._messanger.showMsgBox('A critical error occurred when fetching the task data.\nPlease refresh the page and try again.','error','down');
    }
  }






  //---------------------- Private methods ---------------------//

  _sortCompleteTasks(dbTasks){

    let pendingTasks = dbTasks.filter((task)=>{
      return task.status == 'pending';
    });

    let completeTasks = dbTasks.filter((task)=>{
      return task.status == 'complete';
    });

    return pendingTasks.concat(completeTasks);
  }


  _loadListItems(items){

    if (items.length > 0){
      for (let i=0; i < items.length; i++){
        let listItem = new TaskListItem(this.pageMethods);
        this.listContainer.append(listItem.createItem(items[i]));

      }
    }else{
      let alertMsg = 'No matches found!';
      this.listContainer = this.buildEmptyAlert(alertMsg, icons.projects);
    }
    return this.listContainer;
  }
};
