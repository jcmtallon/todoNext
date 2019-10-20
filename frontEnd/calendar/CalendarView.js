const OPTIONS = require('./../optionHandler/OptionHandler');
const MultiChoiceDropDownMenu = require('./../otherMethods/MultiChoiceDropDownMenu');
const CalendarTaskListForm = require('./CalendarTaskListForm');
const CalendarEditTaskForm = require('./CalendarEditTaskForm');
const Task = require('./../activeTodos/Task');
const styles = require('./../cssClassNames/cssClassNames');
const moment = require('moment');
const utils = require('./../utilities/utils');

module.exports = class StatView{
  constructor(){

    // Saves reference to active task data.
    this.activeTasks = OPTIONS.activeTasks.getActiveTasks();

    // Filters default state
    this.categories = [];
    this.projects = [];
    this.habits = [];

    // Get options for multichoice ddms.
    this.catOptions = this._getOptionsArr(OPTIONS.categories.getCategories());
    this.projOptions = this._getOptionsArr(OPTIONS.projects.getProjectsWithColors());
    this.habOptions = this._getOptionsArr(OPTIONS.habits.getHabitsWithColors());
  }


  // Renders queried calendar.
  getCalendarFor(targetMonth, isFullMode, mustShowFilters){

    // Parse data based on selected filters
    this.activeTasks = this._parseDataSet(this.activeTasks);

    // Query
    this.targetMonth = moment(targetMonth);
    this.isFullMode = isFullMode;
    this.mustShowFilters = mustShowFilters;

    // Detect type of screen
    this.isMobile = utils.detectMobileScreen();

    // Render elements
    this.calendar_row = this._buildCalenderRow();
    this.calendar_row.append(this._buildCalendar());
    this.filter_row = this._buildFilterRow();

    // Hide filters if not requested
    if (!this.mustShowFilters) this.filter_row.css('display', 'none');

    // Compile and return
    return $('<div>', {class: styles.calendarView.container})
      .append(this.calendar_row)
      .append(this.filter_row);
  }


  // Displays filter panel with a slidedown animation.
  showFilters(){
    this.filter_row.css('display', 'none');
    const speed = (this.isMobile) ? 500 : 250;
    this.filter_row.slideDown(speed, 'easeOutQuad');
  }


  // Hides filter panel with a slideup animation.
  hideFilters(){
    const speed = (this.isMobile) ? 500 : 250;
    this.filter_row.show().slideUp(speed, 'easeOutQuad');
  }


  updateCalendar(){
    this.categories = this._getSelectedFilters(this.fld_cats);
    this.projects = this._getSelectedFilters(this.fld_projs);
    this.habits = this._getSelectedFilters(this.fld_habs);

    // Parse data based on selected filters
    this.activeTasks = this._parseDataSet(OPTIONS.activeTasks.getActiveTasks());

    // Remember scroll value (as emptying the calendar row takes the scroll
    // back to the top.)
    const scrollTop = $('#form_background').scrollTop();

    // Re-render calendar
    this.calendar_row.empty();
    this.calendar_row.append(this._buildCalendar());

    // Go to previous scroll value
    $('#form_background').scrollTop(scrollTop);
  }

  refreshCalendarFor(targetMonth, isFullMode, mustShowFilters){

    // Parse data based on selected filters
    this.activeTasks = this._parseDataSet(OPTIONS.activeTasks.getActiveTasks());

    // Query
    this.targetMonth = moment(targetMonth);
    this.isFullMode = isFullMode;
    this.mustShowFilters = mustShowFilters;

    // Detect type of screen
    this.isMobile = utils.detectMobileScreen();

    // Remember scroll value (as emptying the calendar row takes the scroll
    // back to the top.)
    const scrollTop = $('#form_background').scrollTop();

    // Re-render calendar
    this.calendar_row.empty();
    this.calendar_row.append(this._buildCalendar());

    // Go to previous scroll value
    $('#form_background').scrollTop(scrollTop);
  }

  showAddNewTaskForm(dateCopy){
    const task = new Task();
    task.dueTo = dateCopy;

    const addNewTask = (newTask) => {
      this.addNewTask(newTask);
      this.updateCalendar();
    };

    let taskForm = new CalendarEditTaskForm(addNewTask);
    taskForm.loadTask(task);
    taskForm.setAsNewTask();
    taskForm.show();
  }

  showUpdateTaskForm(task){
    const updateTask = (updatedTask) => {
      this.updateTask(updatedTask);
      this.updateCalendar();
    };

    let taskForm = new CalendarEditTaskForm(updateTask);
    taskForm.loadTask(task);
    taskForm.show();
  }

  showCalendarListForm(dateCopy){
    const addNewTaskForm = (date) => this.showAddNewTaskForm(date);
    const updateTaskForm = (task) => this.showUpdateTaskForm(task);
    const taskList = new CalendarTaskListForm(()=>this.updateCalendar());
    taskList.show(dateCopy);
  }

  addNewTask(newTask){
    OPTIONS.activeTasks.addToActiveTasks([newTask]);
    OPTIONS.categories.addToCounters([newTask]);
    OPTIONS.projects.addToCounters([newTask]);
    OPTIONS.updateDb();
  }

  updateTask(task){
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
    this.updateCalendar();
  }

  //---------------- Build methods -----------------//


  _buildCalenderRow(){
    return $('<div>', {class: styles.calendarView.calendarRow});
  }

  _buildCalendar(){

    let calContainer = $('<div>', {class: styles.calendarView.calContainer});

    const headerHeight = 24;
    this.containerHeight = this.getCalContainerHeight();
    this.rowHeight = (this.containerHeight - headerHeight)/6;

    // If full mode, displays all assigned tasks to each cell, no matter
    // how big the calendar becomes. Minimum row height cannot be smaller than a sixth of the screen height.
    // In not full mode, it only displays as many tags fits in the space
    // assigned to the cell.
    if(this.isFullMode){
      calContainer.css('grid-template-rows', 'auto repeat(6, minmax(' + this.rowHeight + 'px , auto))');
    }else{
      calContainer.css('height', this.containerHeight);
    }

    // Render headers
    const daysOfTheWeek = [moment().weekday(0), moment().weekday(1),moment().weekday(2),moment().weekday(3),moment().weekday(4),moment().weekday(5),moment().weekday(6)];
    const headerFormat = (this.isMobile) ? 'ddd' : 'dddd';
    $.each(daysOfTheWeek,(index, item) => {
      let cell = $('<div>', {text: item.format(headerFormat), class: styles.calendarView.calHeaders});
      calContainer.append(cell);
    });

    // Calculate calendar initial date
    const firstDate = this.getFirstDate(this.targetMonth);

    // Render date cells
    for (var i = 0; i < 42; i++) {
      calContainer.append(this.buildCalendarCell(firstDate));
      firstDate.add(1, 'days');
    }

    return calContainer;
  }



  buildCalendarCell(targetDate){

    let dateCopy = moment(targetDate);

    // Get target tasks for this cell
    const tasks = this.activeTasks.filter(task => targetDate.isSame(task.dueTo, 'day'));

    // Render parent element
    let cell = $('<div>', {class: styles.calendarView.calCell + ' droppable', 'data-date': dateCopy.format('YYYY-MM-DD')});

    if(moment().isSame(targetDate, 'day')) cell.addClass(styles.calendarView.todayCalCell);

    // Add grey background style when out of range date.
    if(!this.targetMonth.isSame(targetDate, 'month')) {cell.addClass(styles.calendarView.outOfRangeCell);}

    // Add cell click event
    cell.on('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();

      if(this.isMobile){
        if(tasks.length > 0){
          this.showCalendarListForm(dateCopy);
        }else{
          this.showAddNewTaskForm(dateCopy);
        }

      }else{
        this.showAddNewTaskForm(dateCopy);
      }
    });

    // Render date label
    let dateLabel = $('<div>', {text: targetDate.format('D'), class: styles.calendarView.cellDateLabel});
    cell.append(dateLabel);

    // In full mode print all items for each cell.
    if(this.isFullMode){
      $.each(tasks, (index, task) => {
        cell.append(this.buildLargeTaskTag(task));
      });


    // Print as many tags as the space allows.
    }else{

      // Not full mode + mobile : print circles instead of full tags.
      if (this.isMobile){

        let tagContainer = $('<div>', {class: styles.calendarView.tagContainer});

        const tagHeight = 15;
        const tagWidth = 15;
        const dateRowHeight = 19;
        const cellPadding = 4;
        const columnWidth = ($(window).width()/7) - cellPadding;
        const usableRows = Math.floor((this.rowHeight - dateRowHeight)/tagHeight) - 1;
        const usableColumns = Math.floor(columnWidth/tagWidth);
        const tagsToPrint =  Math.min(tasks.length, usableRows * usableColumns);

        // For as many tags allowed, print tag.
        for (let i = 0; i < tagsToPrint; i++) {
          tagContainer.append(this.buildSmallTaskTag(tasks[i]));
        }

        cell.append(tagContainer);

        // Print ellipsis tag when not all tags printed in cell.
        if(tasks.length>tagsToPrint) cell.append(this.buildEllipsisTag(targetDate));

      }else{

        const tagHeight = 19;
        const dateRowHeight = 28;
        const usableRows = Math.floor((this.rowHeight - dateRowHeight)/tagHeight) - 1;
        const tagsToPrint = Math.min(tasks.length, usableRows);

        // For as many tags allowed, print tag.
        for (let i = 0; i < tagsToPrint; i++) {
          cell.append(this.buildLargeTaskTag(tasks[i]));
        }

        // Print ellipsis tag when not all tags printed in cell.
        if(tasks.length > tagsToPrint) cell.append(this.buildEllipsisTag(moment(targetDate)));
      }
    }

    return cell;
  }

  buildLargeTaskTag(task){
    let span = $('<span>', {text: task.title});
    let tag = $('<div>', {id: task.instantId, class: styles.calendarView.taskTag}).append(span);
    tag.css('background-color', OPTIONS.categories.getColorById(task.categoryId));
    tag = this._addDragBehaviour(tag, task);
    return tag;
  }

  buildSmallTaskTag(task){
    let tag = $('<div>', {class: styles.calendarView.taskTag});
    tag.css('background-color', OPTIONS.categories.getColorById(task.categoryId));
    return tag;
  }

  buildEllipsisTag(targetDate = undefined){
    let span = $('<span>', {text: '>'});
    let tag = $('<div>', {class: styles.calendarView.ellipsisTag}).append(span);

    if(!this.isMobile){
      tag.on('mousedown', (e)=>{
        e.preventDefault();
        e.stopPropagation();
        this.showCalendarListForm(targetDate);
      });
    }

    return tag;
  }



  _buildFilterRow(){
    this.fld_cats = this._buildMultiChoiceSelector(3, this.catOptions);
    this.fld_projs = this._buildMultiChoiceSelector(4, this.projOptions);
    this.fld_habs = this._buildMultiChoiceSelector(5, this.habOptions);

    this.ele_cats = _wrapField(this.fld_cats, 'Categories');
    this.ele_projs = _wrapField(this.fld_projs, 'Projects');
    this.ele_habs = _wrapField(this.fld_habs, 'Habits');

    return $('<div>', {class: styles.calendarView.filterRow})
      .append(this.ele_cats)
      .append(this.ele_projs)
      .append(this.ele_habs);
  }

  _buildMultiChoiceSelector(tabIndex, options){
    let fld = $('<input/>',{class: styles.field.field})
           .addClass(styles.statForm.field)
           .addClass(styles.statView.multi_choide_field)
           .attr('data-selected','')
           .attr('placeholder',' ')
           .attr('autocomplete','off')
           .attr('readonly', true)
           .attr('tabindex', tabIndex);


   function displayMenu(){
     let params ={
       options : options,
       selected: fld.attr('data-selected'),
       width : fld.width() + 12, // 12 represents added padding value.
       triggerHeight: 30,
       root: $('.modal_blackBackground'),
       trigger : fld};
     let ddm = new MultiChoiceDropDownMenu(params);
     ddm.show();
   }

   //If the field is empty, when selecting a date in the datapicker,
   //as the datapicker takes a few instants to add the input, the label
   //animation seems to trigger for a second. To avoid this, we secure
   //that the field at least have one character, in that way, even if the
   //datapicker takes a few instants to start, the animation won't trigger
   //as the field is being detected as populatted.
   fld.focus(()=>{if(fld.val()=='') fld.val(' ');});

   // We get rid of the above white space when focusout.
   // We add a seTimout to wait the datapicker response time, as the reason
   // why the user focused out could be because it clicked on the calendar.
   fld.focusout(()=>{setTimeout( () => {if(fld.val()==' ') fld.val('');}, 200);});

   // Click will automatically focus the input which will trigger the ddm.
   // We add stopPropagation to avoid that this same click triggers the removeMenu
   // event of the ddm.
   fld.click((e)=>{
     e.stopPropagation();
     if ($(`.multichoice`).length == 0) displayMenu();
   });

   fld.on('focus', (e)=>{
     e.preventDefault();
     e.stopPropagation();
     displayMenu();
   });

   return fld;
  }


  //------------------------ Data parsing methods -----------//

  _parseDataSet(data){
    data = this._filterItems(data, this.categories, this.catOptions, 'categoryId');
    data = this._filterItems(data, this.projects, this.projOptions, 'projectId');
    data = this._filterItems(data, this.habits, this.habOptions, 'habitId');
    return data;
  }

  _filterItems(data, selected, options, propertyName){

    // Generate array of selected ids
    const ids = [];
    $.each(selected, (index, value)=>{
      if (value == true) {ids.push(options[index].val);}
    });

    // No filtering if no filter option was selected.
    if (ids.length == 0){
      return data;
    }else{
      return data.filter(filterIds);
    }

    //Filter function
    function filterIds(element){
      return ids.includes(element[propertyName]);
    }
  }

  _getSelectedFilters(field){
    // Get array of booleans (true = options was selected)
    const inputStr = field.attr('data-selected');
    return (inputStr == '') ? [] : JSON.parse(inputStr);
  }

  //---------------- OPTION PARSER FOR MULTI CHOICE DDM --------

  _getOptionsArr(items){

    function applyHightligh(fld, text) {
      if (text!= '' && text!= ' ') {
        fld.addClass(styles.field.field_validInput);
      } else {
        fld.removeClass(styles.field.field_validInput);
      }
    }

    let arr = [];
    $.each(items, (index, item)=>{
      arr.push({
        text: item.title,
        val: item._id,
        color: item.color,
        icon: item.icon,
        action: (fld, selected)=>{

          //Update field state and look
          fld.attr('data-selected', JSON.stringify(selected));
          const inputText = utils.getSelectedInputText(items, selected);
          fld.val(inputText);
          applyHightligh(fld, inputText);

          // Refresh line chart
          this.updateCalendar();
        }
      });
    });
    return arr;
  }


  //----------------- Utilities -------------//

  //Returns initial date of the requested calendar month.
  getFirstDate(targetMonth){
    const first = moment(targetMonth).startOf('month');
    const daysToSubstract = first.weekday();
    return first.subtract(daysToSubstract, 'days');
  }

  getCalContainerHeight(){
    try {
      const containerTop = $('#calendar-row')[0].offsetTop;
      const margins = (this.isMobile) ? 10: 50;
      return $(window).height() - containerTop - margins;

    } catch (e) {
      return this.containerHeight;
    }
  }



  _addDragBehaviour(tag, task){

    let currentDroppable = null;
    let selectedTag = null;
    let clicked = false;
    let clickX;
    let clickY;

    tag.click((e)=>{
      this.showUpdateTaskForm(task);
    });

    tag.on({'mousedown': (e) => {

      e.stopPropagation();
      e.preventDefault();

      selectedTag = $('#' + task.instantId);
      selectedTag.addClass(styles.calendarView.taskTagSelected);

      clicked = true;
      clickX = e.pageX;
      clickY = e.pageY;

      $(window).on({'mousemove': (e) => {

              // Cancel is not clicked.
              if (!clicked) return;

              // Calculate and apply new position
              let minX = -clickX;
              let minY = -clickY;
              let maxX = $(window).width() - clickX;
              let maxY = $(window).height() - clickY;
              let x = Math.min(Math.max(e.pageX - clickX, minX), maxX);
              let y = Math.min(Math.max(e.pageY - clickY, minY), maxY);
              selectedTag.css({'transform' : 'translate(' + x +'px, ' + y + 'px)'});

              // Get element from point
              selectedTag.hide();
              let elemBelow = document.elementFromPoint(e.clientX, e.clientY);
              selectedTag.show();

              // If no element, cancel.
              if (!elemBelow) return;

              // Apply style to current droppable cell
              let droppableBelow = elemBelow.closest('.droppable');
              if (currentDroppable != droppableBelow) {
                if (currentDroppable) {
                  currentDroppable.classList.remove(styles.calendarView.calCellDroppable);
                }
                currentDroppable = droppableBelow;
               if (currentDroppable) {
                 currentDroppable.classList.add(styles.calendarView.calCellDroppable);
               }
              }

              }, 'mouseup': (e) =>{

                clicked = false;
                selectedTag.removeClass(styles.calendarView.taskTagSelected);

                if (currentDroppable) {
                  let updatedTask = new Task(task);
                  updatedTask.dueTo = moment(currentDroppable.getAttribute('data-date'));
                  this.updateTask(updatedTask);

                }else{
                  // Else simply place tag back into place.
                  selectedTag.css({'transform' : 'translate(0px, 0px)'});
                }

                $(window).off('mouseup');
                $(window).off('mousemove');
          }});
    }});

    return tag;
  }
};



////////////////////////// OTHER UTILS ///////////////////////////////

function _wrapField(field, labelText){
  let label = $('<span>',{text: labelText, class: styles.field.label})
              .click((e)=>{
                e.stopPropagation();
                field.focus();
              });

  return $('<div>', {class: styles.field.container})
         .addClass(styles.statView.field_container)
         .append(field)
         .append(label);
}
