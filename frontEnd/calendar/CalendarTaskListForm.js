const Form = require('./../forms/form');
const icons = require('./../icons/icons.js');
const OPTIONS = require('./../optionHandler/OptionHandler');
const CalendarEditTaskForm = require('./CalendarEditTaskForm');
const Task = require('./../activeTodos/Task');
const moment = require('moment');

module.exports = class CalendarTaskListForm extends Form{
  constructor(refreshCalendar){
    super();

    // Tells the Form parent to center the form vertically.
    this.isCentered = true;
    this.formWidth = 400;

    this.refreshCalendar = refreshCalendar;

    this.activeTasks = OPTIONS.activeTasks.getActiveTasks();
  }


  show(targetDate){

    this.targetDate = targetDate;

    // Build header
    this.header = this.buildHeader('Tasks', icons.activeTasks('#1551b5'));

    this.bodyRows = [];
    this.bodyRows.push(this._buildDateTitle());
    this.bodyRows.push(this._buildTaskList());
    this.bodyRows.push(this._buildButtonRow());

    this.body = this.buildBody(this.bodyRows);
    this.form = this.buildForm(this.header,
                               this.body);

    $(document.body).append(this.form);
  }

  refreshList(){
    this.tagContainer.empty();
    this._reRenderTagContainer();
  }


  removeForm(){
    this._closeForm();
  }


  //-------------- Private methods ----------//

  _closeForm(){
    //Remove all open ddm first.
    $('.ddm_Container').remove();

    this.form.remove();
  }

  _buildDateTitle(){
    let title = $('<div>', {text: this.targetDate.format('MMMM DD, YYYY'),
                            class: 'cal-task-list_date-title'});
    let col = $('<td>').append(title);
    return $('<tr>').append(col);
  }


  _buildTaskList(){
    this.tagContainer = $('<div>', {class: 'cal-task-list_container'});

    const tasks = this.activeTasks.filter(task => this.targetDate.isSame(task.dueTo, 'day'));

    $.each(tasks, (index, task) => {
      this.tagContainer.append(this._buildTaskTag(task));
    });

    let col = $('<td>').append(this.tagContainer);
    return $('<tr>').append(col);
  }

  _buildTaskTag(task){
    let span = $('<span>', {text: task.title});
    let tag = $('<div>', {class: 'cal-task-list_tag-task'}).append(span);
    tag.css('background-color', OPTIONS.categories.getColorById(task.categoryId));
    tag.click((e) => {
      e.preventDefault();
      e.stopPropagation();

      const updateTask = (task) => {this._updateTask(task);};

      let taskForm = new CalendarEditTaskForm(updateTask);
      taskForm.loadTask(task);
      taskForm.show();

    });
    return tag;
  }


  _buildButtonRow(){
    this.addNewButton = $('<span>', {text:'Add new', class:'blue_botton'})
                       .addClass('cal-task-list_add-new-task-btn')
                       .click((e)=>{
                         e.stopPropagation();
                         e.preventDefault();

                         const task = new Task();
                         task.dueTo = this.targetDate;

                         const addNewTask = (newTask) => {this._addNewTask(newTask);};

                         let taskForm = new CalendarEditTaskForm(addNewTask);
                         taskForm.loadTask(task);
                         taskForm.setAsNewTask();
                         taskForm.show();
                       });

    let col = $('<td>').css('text-align', 'center').append(this.addNewButton);
    return $('<tr>').append(col);
  }

  _addNewTask(newTask){
    OPTIONS.activeTasks.addToActiveTasks([newTask]);
    OPTIONS.categories.addToCounters([newTask]);
    OPTIONS.projects.addToCounters([newTask]);
    OPTIONS.updateDb();
    this.refreshCalendar();
    this.refreshList();
  }

  _updateTask(task){
    let taskBUp = OPTIONS.activeTasks.getTaskByInstantId(task.instantId);

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
    }else{
      OPTIONS.activeTasks.updateAndRepositionTask(task);
    }

    OPTIONS.updateDb();
    this.refreshCalendar();
    this.refreshList();
  }

  _reRenderTagContainer(){
    this.activeTasks = OPTIONS.activeTasks.getActiveTasks();
    const tasks = this.activeTasks.filter(task => this.targetDate.isSame(task.dueTo, 'day'));

    $.each(tasks, (index, task) => {
      this.tagContainer.append(this._buildTaskTag(task));
    });
  }
};
