const Page = require('./../pages/page');
const OPTIONS = require('./../optionHandler/OptionHandler');
const ActiveTaskListView = require('./activeTaskListView');
const EditActiveTaskForm = require('./activeTaskEditForm');
const HabitTaskFactory = require('./../habits/habitTaskFactory');
const FilteredTaskForm = require('./../filteredTasks/FilteredTaskForm');
const QuickStatForm = require('./../quickStats/QuickStatForm');
const NoteEditorForm = require('./notesForm');
const ProgressForm = require('./progressForm');
const ScoreForm = require('./scoreForm');
const MsgBox = require('./../messageBox/messageBox');
const pointFactory = require('./../pointFactory/pointFactory');
const flashMsg = require('./../messageBox/flashMsg');
const filteredTasPage = require('./../filteredTasks/filteredTaskPage');
const moment = require('moment');
const utils = require('./../utilities/utils');

let _messanger;


/**
 * Component with methods for:
 * - Rendering and refreshing all the elements in the active task page.
 * - Methods for calling and reacting to all the different forms that can be prompted
 *  from the active task page.
 * - Methods for emitting and subscribing to the Option object (state store).
 */
class ActiveTaskPage extends Page{
  constructor(){
    super();

    // Used to display popup messages in the screen.
    _messanger = new MsgBox();

    // Title displayed on the top of the page
    this.pageName = 'activeTasks';

    // Buttons displayed in the top of the page.
    this.quickStatsBtn = {
      id: '',
      text:'Quick stats',
      action: function(){
          let form = new QuickStatForm();
          form.show();
        }
    };
    this.filtersBtn = {
      id: 'topBar_taskFilter_btn',
      text: 'Filters',
      action: async () => {
        let projects = await OPTIONS.projects.getProjectOptions();
        let form = new FilteredTaskForm((renderQ, searchQ)=>filteredTasPage.show(renderQ, searchQ), projects);
        form.displayForm();
      }
    };

    // Buttons added to this array are automically added to the top par of the page
    // by the parent class Page.
    this._topBarBtns = [this.quickStatsBtn, this.filtersBtn];

    // Callbacks for the different forms prompted by this page.
    this.methods = {
      showPage: () => {this.showPage();},
      removeItem: (instantId, taskTop) => {this.removeItemByInstantId(instantId, taskTop);},
      setAsPending : (instantId) => {this.setItemAsPending(instantId);},
      toggleActiveStatus: (instantId) => {this.toggleActiveStatus(instantId);},
      setAsComplete : (instantId, taskTop) => {this.markTaskAsComplete(instantId, taskTop);},
      openNoteEditor : (instantId) => {this.openNoteEditor(instantId);},
      openProgressEditor: (instantId) => {this.openProgressEditor(instantId);},
      displayScoreForm: (instantId, taskTop) => {this.displayScoreForm(instantId, taskTop);},
      editItem: (instantId) => {this.displayEditListItemForm(instantId);}
    };
  }



  //--------------- View methods ----------------------//

  /**
   * Removes existing elements in the editor and editor
   * top bar and appends new list view
   */
  showPage(noScroll){

    localStorage.setItem('currentPage', this.pageName);

    if(OPTIONS.activeTasks.isEmpty()){
      this._pageTitle = 'Active tasks';
    }else{
      this._pageTitle = 'Overdue';
    }

    const scrollTop = $(document).scrollTop();

    this.setPage();
    if(!noScroll){this.scrollPageToTop();}

    this.listView = new ActiveTaskListView(this.methods);
    let taskList = this.listView.getList();
    this._Editor.insertContents(taskList);

    $("html").scrollTop(scrollTop);
  }

  /**
   * Refreshes the screen without scrolling.
   */
  showPageWithoutScroll(){
    let noScroll = true;
    this.showPage(noScroll);
  }

  /**
   * Shows page with fade in effect at the beginning.
   */
  showPageWithFadeIn(){
    this.showPage();
    this.listView.fadeInList();
  }

  /**
   * Shows page with fade in highlighting all new items
   * in the list.
   */
  showPageWithFadeInAndHightlights(){
    this.showPage();
    this.listView.fadeInList();
    this.listView.hightlightNewItems();
  }

  /**
   * Shows page highlighting all new items
   * in the list.
   */
  showPageWithHightlights(){
    this.showPage();
    this.listView.hightlightNewItems();
  }

  /**
   * Shows page highlighting specified item
   */
  showPageAndHightlightByInstantId(instantId){
    this.showPage();
    this.listView.hightlightByInstantId(instantId);
  }





  //-----------------Habits methods --------------//

  /**
   * Check if new habit tasks must be generated.
   * If affirmative, generates tasks, refreshes lastHabitDate
   * and saves option object into db.
   */
  checkHabits(){
    OPTIONS.activeTasks.rememberInstantIds();

    if (OPTIONS.logs.mustGenerateHabits()){
      let optBUp = OPTIONS.getLocalOptions();
      this.generateHabitTasks();
      OPTIONS.logs.setLastHabitDateAsToday();
      this.saveOptions(optBUp);
    }
  }

  /**
   * Generates new habit tasks.
   */
  generateHabitTasks(){
      let factory = new HabitTaskFactory();
      factory.generateHabitTasks();
  }












  // --------------- Task methods -------------------//

  /**
   * Removes indicated item from option active task list
   * and refreshes the page.
   */
  removeItemByInstantId(instantId, taskTop){

    if(utils.noConnection(()=>{this.showPageWithFadeIn();})){return;}

    let optionBUp = OPTIONS.getLocalOptions();
    let removedTask = OPTIONS.activeTasks.getTaskByInstantId(instantId);

    taskTop =  (taskTop!=undefined) ? taskTop : $(`[data-instantId=${instantId}]`)[0].offsetTop;
    flashMsg.showAlertMsg('Removed!', taskTop);

    this.listView.removeItemByInstantId(instantId);
    OPTIONS.activeTasks.removeActiveTaskByInstantId(instantId);

    // Udpates stats (if necessary)
    OPTIONS.categories.restFromCounters([removedTask]);
    OPTIONS.projects.restFromCounters([removedTask]);

    this.saveOptions(optionBUp);
  }

  /**
   * Saves specified task into the database task collection
   * as a pending task. Updates the pending task counter and
   * updates the listview and local option object.
   */
  setItemAsPending(instantId){

    if(utils.noConnection(()=>{this.showPageWithFadeIn();})){return;}

    let optionBUp = OPTIONS.getLocalOptions();
    let pendingTask = OPTIONS.activeTasks.makePendingTask(instantId);

    const listItemTop = $(`[data-instantId=${instantId}]`)[0].offsetTop;
    flashMsg.showPlainMsg('See you later!', listItemTop);

    this.listView.removeItemByInstantId(instantId);
    OPTIONS.activeTasks.removeActiveTaskByInstantId(instantId);

    OPTIONS.stats.sumToPending(1);

    try{
      OPTIONS.updateDb();
      OPTIONS.activeTasks.saveIntoDb([pendingTask]);

    } catch (err){
      _messanger.showMsgBox('Failed to save data.\nPlease refresh the page and try again.','error','down');
      console.log(err);
      OPTIONS.updateLocalOptions(optionBUp);
      OPTIONS.updateDb();
      this.showPageWithFadeIn();
    }
  }



  /**
   * Toggles 'ongoing' status value for specified task status and refreshes the list.
   *
   * @param  {String} instantId
   */
  toggleActiveStatus(instantId){
    if(utils.noConnection(()=>{this.showPageWithFadeIn();})){return;}

    let optionBUp = OPTIONS.getLocalOptions();

    OPTIONS.activeTasks.toggleActiveStatus(instantId);

    try {
      OPTIONS.updateDb();
      this.showPageWithoutScroll();

    } catch (e) {
      _messanger.showMsgBox('Failed to save data.\nPlease refresh the page and try again.','error','down');
      console.log(err);
      OPTIONS.updateLocalOptions(optionBUp);
      OPTIONS.updateDb();
      this.showPageWithFadeIn();
    }
  }

  /**
   * Saves specified task into the database task collection
   * as a complete task. Updates the pending task counter and
   * updates the listview and local option object.
   */
  markTaskAsComplete(instantId, taskTop, score = undefined){

    let optionBUp = OPTIONS.getLocalOptions();
    let completeTask = OPTIONS.activeTasks.makeCompleteTask(instantId);

    this.listView.removeItemByInstantId(instantId);
    OPTIONS.activeTasks.removeActiveTaskByInstantId(instantId);

    OPTIONS.stats.sumToComplete(1);
    OPTIONS.projects.addToComplete([completeTask]);
    OPTIONS.categories.addToComplete([completeTask]);

    OPTIONS.checkForRecords();
    OPTIONS.stats.sumCompletedTask(1);

    //If it is a habit task and fixed period option is off,
    //we reset the habit lastTaskDate to today so the next habit
    //is calculated the following day.
    if (completeTask.habitId!='' && OPTIONS.logs.getFixedPeriodsVal()!=true){
      let habit = OPTIONS.habits.getHabitById(completeTask.habitId);
      habit.lastTaskDate = moment().startOf('day');
      OPTIONS.habits.updateHabit(habit);
    }

    // TODO: improve this.
    // We make a copy that we can send with the progress matching the number of hours.
    // In this way we still have the completeTask object that we can send to the factory
    // to generate points.
    let completeTaskCopy = JSON.parse(JSON.stringify(completeTask));
      completeTaskCopy.progress = (score== undefined) ? completeTaskCopy.hours : score;


    try{
      OPTIONS.activeTasks.saveIntoDb([completeTaskCopy]);
      pointFactory.generatePointFromTask(completeTask, taskTop, score);
      OPTIONS.updateDb();

    } catch (err){
      _messanger.showMsgBox('Failed to save data.\nPlease refresh the page and try again.','error','down');
      console.log(err);
      OPTIONS.updateLocalOptions(optionBUp);
      OPTIONS.updateDb();
      this.showPageWithFadeIn();
    }
  }

  /**
   *  Updates existing task with new task data and
   *  refreshes the screen.
   */
  async updateTask(task, height = undefined){
    let optionBUp = OPTIONS.getLocalOptions();
    let taskBUp = OPTIONS.activeTasks.getTaskByInstantId(task.instantId);

    // If progress or hours value changed, update point counter and generate/remove points.
    if(task.progress != taskBUp.progress){
      pointFactory.manageDbPoints(task, taskBUp, height);
    }

    // If different category, update category.
    if(task.categoryId != taskBUp.categoryId){
      OPTIONS.categories.addToCounters([task]);
      OPTIONS.categories.restFromCounters([taskBUp]);
    }
    // If different project, update project.
    if(task.projectId != taskBUp.projectId){
      OPTIONS.projects.addToCounters([task]);
      OPTIONS.projects.restFromCounters([taskBUp]);
    }

    // If different date, update position.
    if(moment(task.dueTo).isSame(taskBUp.dueTo,'day')){
      OPTIONS.activeTasks.updateActiveTask(task);
      this.showPageWithoutScroll();
    }else{
      OPTIONS.activeTasks.updateAndRepositionTask(task);
      this.showPageAndHightlightByInstantId(task.instantId);
    }

    try{
      OPTIONS.updateDb();

    } catch (err){
      _messanger.showMsgBox('Failed to update task data. Please refresh the page and try again.','error','down');
      console.log(err);
      OPTIONS.updateLocalOptions(optionBUp);
      this.showPageWhFadeIn();
    }
  }











  // ---------------------- Forms -------------------//

  /**
   * Displays the note editor form with the note data
   * of the selected task loaded (if there is).
   */
  openNoteEditor(instantId){
    let saveCallback = (updatedTask) =>{
      this.updateTask(updatedTask);
    };

    let task = OPTIONS.activeTasks.getTaskByInstantId(instantId);
    let noteForm = new NoteEditorForm(saveCallback, task);
    noteForm.displayForm();
  }

  /**
   * Displays the progress editor form with the progress data
   * of the selected task loaded (if there is).
   */
  openProgressEditor(instantId){
    // Get top offset value so flash msg can be displayed at that height.
    const listItemTop = $(`[data-instantId=${instantId}]`)[0].offsetTop;

    let saveCallback = (updatedTask) =>{
      this.updateTask(updatedTask, listItemTop);
    };

    let task = OPTIONS.activeTasks.getTaskByInstantId(instantId);
    let progressForm = new ProgressForm(saveCallback, task);
    progressForm.displayForm();
  }

  /**
   * Displays active task editor form.
   */
  displayEditListItemForm(instantId){
    let targetTask = OPTIONS.activeTasks.getTaskByInstantId(instantId);
    let taskForm = new EditActiveTaskForm(this, targetTask);
    taskForm.displayForm();
  }

  /**
   * Displays the score editor form.
   */
  displayScoreForm(instantId, taskTop){

    if(utils.noConnection(()=>{this.showPageWithFadeIn();})){return;}

    let saveCallback = (task, score) =>{
      this.markTaskAsComplete(instantId, taskTop, score);
    };

    let cancelCallback = () =>{
      this.showPageWithoutScroll();
    };

    let task = OPTIONS.activeTasks.getTaskByInstantId(instantId);
    let scoreForm = new ScoreForm(saveCallback, cancelCallback, task);
    scoreForm.displayForm();
  }












  //-------------------- Save options --------------//

    /**
     * Saves latest version of option object into db.
     * If failes, restores options with specified backup.
     */
    saveOptions(optBUp){
      try {
        OPTIONS.updateDb();

      } catch (err){
        _messanger.showMsgBox('Failed to save new data. Please refresh the page and try again.','error','down');
        console.log(err);
        OPTIONS.updateLocalOptions(optBUp);
        this.showPageWithFadeIn();
      }
    }
}

module.exports = new ActiveTaskPage();
