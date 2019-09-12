const OPTIONS = require('./../optionHandler/OptionHandler');
const ListView = require('./../lists/list');
const TaskListItem = require('./TaskListItem');
const Task = require('./../activeTodos/Task');

const loader = require('./../otherMethods/Loader');
const icons = require('./../icons/icons.js');

/**
 * Represents a list of tasks that the user can filtered
 * using different condition selectors and a search button.
 * TODO: detailed explanation
*/
module.exports = class FilteredTaskListView extends ListView{
  constructor(pageMethods, filterPage){
    super();

    this.filterPage = filterPage;
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
  async getList(query = {pageNb: 1}, renderQuery = undefined){

    this.query = query;

    try {

      if(!renderQuery.hasOwnProperty('loader')) loader.displayLoader();

      this.listContainer.empty();
      query.size = this.listSize;

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

      // Retrieve db tasks and also complete list of projects (used for tag labels) in parallel.
       [this.dbTaskObj, this.dbProjects] = await Promise.all([OPTIONS.tasks.getTasksByQuery(query), OPTIONS.projects.getAllProjectList()]);


      // Calculate number of pages.
      let totalTaskCnt = actTaskObj.totalCount + this.dbTaskObj.totalCount;
      this.pageCnt = Math.ceil(totalTaskCnt / this.listSize);

      // Places pending tasks first in the array (if there are);
      let sortedTasks = this._sortCompleteTasks(this.dbTaskObj.tasks);

      // Contact both task lists and render.
      let tasks = actTaskObj.tasks.concat(sortedTasks);
      this.list = this._loadListItems(tasks, this.dbProjects.projects);

      if(!renderQuery.hasOwnProperty('loader')) loader.removeLoader();
      if(renderQuery.hasOwnProperty('loader')) renderQuery.loader();

      return this.list;

    } catch (e) {
      console.log(e);
      this._messanger.showMsgBox('A critical error occurred when fetching the task data. Please refresh the page and try again.','error','down');

      loader.removeLoader();
      this.list = this._loadListItems([]);
      return this.list;
    }
  }

  /**
   * Displays filtered task list view with most recent local active task data
   * together with the received pending, complete task data.
   * Used to reload the filtered list view without having to re-download data
   * from the database again.
   * @param  {Object} assets
   * @param  {Object} query
   * @return {DOM} jquery
   */
  refreshView(assets, query){

    this.pageCnt = assets.pageCnt;
    this.dbTaskObj = assets.dbTaskObj;
    this.dbProjects = assets.dbProjects;

    this.listContainer.empty();

    // Retrieve active tasks from local options.
    let actTaskObj = OPTIONS.activeTasks.getTasksByQuery(query);

    // Places pending tasks first in the array (if there are);
    let sortedTasks = this._sortCompleteTasks(assets.dbTaskObj.tasks);

    // Contact both task lists and render.
    let tasks = actTaskObj.tasks.concat(sortedTasks);
    this.list = this._loadListItems(tasks, assets.dbProjects.projects);

    return this.list;
  }

  getFilterTagRow(query){

    function taggify(label, tag){
      let cont = $('<div>', {class:'filter-tag__tag-container'});
      cont.append($('<div>',{text: label, class: 'filter-tag__label'}));
      cont.append($('<div>',{text: tag, class: 'filter-tag__tag'}));
      return cont;
    }

    let row = $('<div>',{class: 'filter-tag-row'});

    if (query.hasOwnProperty('status') && query.status!=undefined){
      let statusName = (query.status!='') ? query.status : 'New';
      row.append(taggify('Status:', statusName));
    }

    if (query.hasOwnProperty('categoryId') && query.categoryId!=undefined){
      let catName = OPTIONS.categories.getCategoryNameById(query.categoryId);
      catName = (catName != undefined) ? catName : 'Other';
      row.append(taggify('Category:', catName));
    }

    if (query.hasOwnProperty('projectId') && query.projectId!=undefined){
      let projName = OPTIONS.projects.getNameFromAllProjects(query.projectId);
      row.append(taggify('Project:', projName));
    }

    if (query.hasOwnProperty('habitId') && query.habitId!=undefined){
      let habitName = OPTIONS.habits.getHabitNameById(query.habitId);
      row.append(taggify('Habit:', habitName));
    }

    return $('<div>', {class: 'filter-tag-row__wrapper'}).append(row);
  }

  /**
   * Returns an object with the necessary assets so a new list class object
   * can display the same list with the most recent active task data but
   * without having to re-download the pending, complete task data again.
   * @return {Object}
   */
  getListAssets(){
    return {
      dbTaskObj: this.dbTaskObj,
      dbProjects : this.dbProjects,
      pageCnt : this.pageCnt
    };
  }


  /**
   * Gets specified task object from download complete, pending
   * task data
   * @param  {String} instantId
   * @return {Task}
   */
  getTaskByInstantId(instantId){
    let targetTask = this.dbTaskObj.tasks.find (obj => {return obj.instantId == instantId;});
    if (targetTask != undefined){
      let task =  new Task(targetTask);
      return task;
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


  _loadListItems(items, projects){

    if (items.length > 0){
      for (let i=0; i < items.length; i++){
        let listItem = new TaskListItem(this.pageMethods, this.filterPage, projects);
        this.listContainer.append(listItem.createItem(items[i]));

      }
    }else{
      let alertMsg = 'No matches found!';
      this.listContainer = this.buildEmptyAlert(alertMsg, icons.projects);
    }
    return this.listContainer;
  }
};
