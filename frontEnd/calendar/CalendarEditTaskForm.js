const OPTIONS = require('./../optionHandler/OptionHandler');
const Form = require('./../forms/form');
const Task = require('./../activeTodos/Task');
const DropDownMenu = require('./../forms/dropDownMenu');
const BooleanButton = require('./../forms/booleanButton');
const SetCurlet = require('./../otherMethods/setCaret');
const icons = require('./../icons/icons.js');
const colors = require('./../selectables/colors');
const urgencyLevels = require('./../selectables/urgencyLevels');
const moment = require('moment');
const utils = require('./../utilities/utils');


module.exports = class CalendarEditTaskForm extends Form{
  constructor(saveMethod){
    super();

    this.saveMethod = saveMethod;

    // Form parameters
    this.titleChrLimit = 300;
    this.isNewTask = false;

    // Build and set ddm elements.
    this._setDropDownMenus();

    // Build form layout
    this._buildForm();
  }

  loadTask(preTask = undefined){
      this._inputPreloadedHabit(preTask);
  }

  setAsNewTask(){
    this.isNewTask = true;
  }

  show(){
    $(document.body).append(this.form);
    this._focusNameField();
  }

  removeForm(){
    this._closeForm();
  }


  //--------------------- Pretask methods ------------------//

  _inputPreloadedHabit(preTask){
    // Abort of no task.
    if(preTask == undefined) return;

    this.preloadedTask = preTask;

    this.nameField.text(this.preloadedTask.title);

    // Update date
    let dueTo = moment(this.preloadedTask.dueTo).format("D MMM, YY");
    this.dueToField.val(dueTo);
    this.dueToField.addClass('recognized_dueDate');
    this.dueToField.css('background-color','#f4f4f4');

    // Little hack
    if (this.preloadedTask.urgency === '') this.preloadedTask.urgency = 'Normal';

    // Update ddm elements
    this._updateCategoryField(this.preloadedTask.categoryId);
    this._updateProjectField(this.preloadedTask.projectId);
    this._updateField(this.urgencyField, this.preloadedTask.urgency);

    // Update booleans
    if (this.preloadedTask.isLearning){this._btnObj.toogleValue(true);}
  }

  _saveTask(){
    let isValidInput = this._checkFormInput();
    if (isValidInput){

      if(this.isNewTask){
        let newTask = this._getNewTask();
        this.saveMethod(newTask);
        this.removeForm();

      }else{
        let task = this._updateTaskWithInput(this.preloadedTask);
        this.saveMethod(task);
        this.removeForm();
      }
    }
  }


  _checkFormInput(){
      // Abort if no internet connection.
      if(!navigator.onLine){
        this.displayErrorMsg('Failed to add item. \nCheck if there is an internet connection.','error','down');
        return;
      }

      // Abort if no name.
      if (this.nameField.text()==''){
        this.displayErrorMsg('Task name cannot be empty.','error','down');
        return;
      }

      // Abort if no valid number of days
      let dueToInput = this.dueToField.val();
      if(dueToInput==''){
        this.displayErrorMsg('Due date cannot be empty.','error','down');
        return;
      }

      if(!isValidDate(new Date(dueToInput))){
        this.displayErrorMsg('Due date value must be a valid date.','error','down');
        return;
      }

      // Abort if no urgency selected
      if(this.urgencyField.attr('data-value') == ''){
        this.displayErrorMsg('Urgency field cannot be empty.','error','down');
        return;
      }

      return true;
  }

  _getNewTask(){
    let catId = this.catPickField.attr('data-value');
    let cat = OPTIONS.categories.getCategoryById(catId);

    let projId = this.projectField.attr('data-value');
    let proj = OPTIONS.projects.getProjectById(projId);

    let newTask = new Task();
    newTask.progress = 0;
    newTask.hours = 1;

    newTask.title = this.nameField.text();
    newTask.categoryId = (cat!=undefined) ? cat._id :'';
    newTask.projectId = (proj!=undefined) ? proj._id :'';
    newTask.dueTo = new Date(this.dueToField.val());
    newTask.urgency = this.urgencyField.attr('data-value');

    let learning = this.learningField.attr('data-value');
    newTask.isLearning = (learning=='true') ? true : false;

    return newTask;
  }

  _updateTaskWithInput(preTask){
    let catId = this.catPickField.attr('data-value');
    let cat = OPTIONS.categories.getCategoryById(catId);

    let projId = this.projectField.attr('data-value');
    let proj = OPTIONS.projects.getProjectById(projId);

    let newTask = new Task();
    newTask.id = preTask.id;
    newTask.instantId = preTask.instantId;
    newTask.habitId = preTask.habitId;
    newTask.progress = preTask.progress;
    newTask.notes = preTask.notes;
    newTask.status = preTask.status;
    newTask.hours = preTask.hours;

    newTask.title = this.nameField.text();
    newTask.categoryId = (cat!=undefined) ? cat._id :'';
    newTask.projectId = (proj!=undefined) ? proj._id :'';
    newTask.dueTo = new Date(this.dueToField.val());
    newTask.urgency = this.urgencyField.attr('data-value');

    let learning = this.learningField.attr('data-value');
    newTask.isLearning = (learning=='true') ? true : false;

    return newTask;
  }


  //--------------------- Build form -----------------------//

  _buildForm(){

    //Header
    this.titleText = 'Add new task';
    this.header = this.buildHeader(this.titleText, icons.activeTasks('#1551b5'));

    // Form controllers
    this.nameField = this._buildNameField();
    this.dueToField = this._buildDueToField();
    this.catPickField = this._buildCatPickField();
    this.projectField = this._buildProjectField();
    this.urgencyField = this._buildUrgencyPickField();
    this.learningField = this._buildLearningField();
    this.saveButton = this._buildSaveButton();
    this.cancelButton = this._buildCancelButton();


    //Compile form rows
    this.bodyRows = [];
    this.bodyRows.push(this._buildNameAndDueTo(this.nameField, this.dueToField));
    this.bodyRows.push(this._buildCatUrgRow(this.catPickField, this.urgencyField));
    this.bodyRows.push(this._buildOptionRow(this.projectField, this.learningField));
    this.bodyRows.push(this._buildButonRow(this.saveButton, this.cancelButton));

    //Compile form
    this.body = this.buildBody(this.bodyRows);
    this.form = this.buildForm(this.header, this.body);

  }

  _buildNameField(){
    let field = $('<div>', {class: 'form_textInputField'})
                .attr('placeholder','Task name...')
                .attr('contenteditable','true')
                .attr('autocomplete','off')
                .attr('tabindex','1')
                .css('cursor','text');

    return this._addCharacterLimitEvent(field, this.titleChrLimit);
  }

  _addCharacterLimitEvent(field, chrLimit){
    field.on('keydown paste', (e) => {
        // Prevent exceeding the character limit.
       if (field.text().length >= chrLimit &&
          e.keyCode != 9 &&  // tab
          e.keyCode != 8 &&  //back space
          e.keyCode != 37 && // left arrow
          e.keyCode != 38 && // up
          e.keyCode != 39 && // right
          e.keyCode != 40 && // down
          e.keyCode != 46) { // delete
           e.preventDefault();
       }
    });
    return field;
  }

  _buildDueToField(){
    let field = $('<input>', {class: 'form_textInputField'})
                 .attr('placeholder','Due to...')
                 .attr('autocomplete','off')
                 .attr('tabindex','2')
                 .css({'width':'90px', 'text-align':'center'});

    return this._setDueDateEvents(field);
  }

  _setDueDateEvents(field){
    // Set jquery ui datapicker
    field.datepicker({ minDate: 0, maxDate: "+5Y +10D" });
    field.datepicker( "option", "dateFormat","d M, y");

    // Highlights input when the user inserts a valid date.
    field.on("input", () => highlightIfDate(field));
    field.on("change", () => highlightIfDate(field));

    return field;
  }

  _buildCatPickField(){
    let textHolder = 'Select a category...';
    let fieldId = 'catSelectDdm';
    let tabIndex = '3';
    let field = this._catDDM.createDdmWithColors(textHolder, fieldId, tabIndex);
    return field;
  }

  _buildProjectField(){
    let textHolder = 'Select a project...';
    let fieldId = 'projSelectDdm';
    let tabIndex = '5';
    let field = this._projDDM.createDdmWithColors(textHolder, fieldId, tabIndex);
    return field;
  }

  _buildUrgencyPickField(){
    let textHolder = 'Urgency...';
    let fieldId = 'urgencySelectDdm';
    let tabIndex = '4';
    let field = this._urgDDM.createDdmWithIcons(textHolder, fieldId, tabIndex);
    return field;
  }

  _buildLearningField(){
    this._btnObj = new BooleanButton('Learning', icons.learning);
    let btn = this._btnObj.createButtonWithIcon(false);
    btn.attr('tabindex','6');
    return btn;
  }

  _buildSaveButton(){
    return $('<span>', {text:'Save', class:'blue_botton'})
            .attr('tabindex','7')
            .css('margin-right','9px')
            .css('width','52px') //So it displays the same size as cancelbtn
            .on('click', (e) => {
                e.stopPropagation();
                this._saveTask();
            });
  }

  _buildCancelButton(){
    return $('<span>', {text:'Cancel', class:'blue_botton'})
            .attr('tabindex','8')
            .on('click',(e) => {
              e.stopPropagation();
              this.removeForm();
            });
  }

  _buildNameAndDueTo(name, dueTo){
    return $('<tr>',{}).append(this._buildCategoryNameCol(name))
                       .append(this._buildDueToCol(dueTo));
  }

  _buildCategoryNameCol(field){
    return $('<td>', {})
          .css('width', '100%')
          .css('padding', '6px')
          .css('padding-right','1px')
          .append(field);
  }

  _buildDueToCol(dueTo){
    return $('<td>', {})
            .css('padding', '6px 6px 6px 6px')
            .css('min-width','70px')
            .css('text-align','center')
            .append(dueTo);
  }

  _buildCatUrgRow(catPick, urgency) {
    return $('<tr>',{}).append(this._buildCatPickCol(catPick))
                       .append(this._buildUrgencyCol(urgency));
  }

  _buildCatPickCol(field){
    return $('<td>', {})
            .css('padding', '0px 0px 6px 6px')
            .css('min-width','38px')
            .css('width','50%')
            .append(field);
  }

  _buildUrgencyCol(field){
    return $('<td>',{})
            .css('padding', '0px 6px 6px 6px')
            .css('width', '30%')
            .append(field);
  }

  _buildOptionRow(projPick, learning) {
    return $('<tr>',{})
          .append(this._buildProjPickCol(projPick))
          .append(this._buildLearningBtnCol(learning));
  }

  _buildProjPickCol(field){
    return $('<td>', {})
        .css('padding', '0px 0px 6px 6px')
        .css('min-width','50%')
        .css('width','100%')
        .append(field);
  }

  _buildLearningBtnCol(field){
    return $('<td>',{})
            .css('padding', '0px 6px 6px 6px')
            .css('width', '120px;')
            .append(field);
  }

  _buildButonRow(saveBtn, cancelBtn) {
    return $('<tr>',{}).append(this._buildLowerButtonCol(saveBtn, cancelBtn));
  }

  _buildLowerButtonCol(saveBtn, cancelBtn){
    return $('<td>', {})
            .css('width', '100%')
            .css('padding', '12px 6px 0px')
            .css('text-align', 'right')
            .append(saveBtn)
            .append(cancelBtn);
  }



  //-------------------- Settings form  -------------------//

  _setDropDownMenus(){

    // Build ddm elements
    this._catDDM = new DropDownMenu(OPTIONS.categories.getCategories());
    this._projDDM = new DropDownMenu(OPTIONS.projects.getProjectsWithColors());
    this._urgDDM = new DropDownMenu(urgencyLevels);

    // Listen to ddm emits
    this._catDDM.on('optionWasSelected', (selection) => this._updateCategoryField(selection));
    this._urgDDM.on('optionWasSelected', (selection) => this._updateField(this.urgencyField, selection));
    this._projDDM.on('optionWasSelected', (selection) => this._updateProjectField(selection));
  }

  _updateCategoryField(optionId, ignoreProjectField = false){

    let cat = OPTIONS.categories.getCategoryById(optionId);

    if (cat == undefined){
      this.catPickField.text('Select a category...')
                        .attr('data-value', '')
                        .css('text-align','left')
                        .css('color','grey')
                        .css('font-weight','normal')
                        .css('border-style','solid')
                        .css('background-color','white');
      return;
    }

    this.catPickField.text(cat.title)
                     .attr('data-value', cat._id)
                     .css('text-align','center')
                     .css('color','white')
                     .css('font-weight','bold')
                     .css('border-style','none');

    this.catPickField.animate({backgroundColor: cat.color}, 500 );

    // If projectField was received, it means we should restart
    // the value and look in any case.
    if(!ignoreProjectField){
      this.projectField.text('Select a project...')
                       .attr('data-value', '')
                       .css('text-align','left')
                       .css('color','grey')
                       .css('background-color','white')
                       .css('font-weight','normal')
                       .css('border-style','solid');
    }
  }

  _updateField(field, selection) {
    field.text(selection)
         .attr('data-value', selection)
         .css('text-align','center')
         .css('color','#1551b5')
         .css('font-weight','bold')
         .css('background-color','#f4f4f4');
  }

  _updateProjectField(optionId){

    let proj = OPTIONS.projects.getProjectById(optionId);

    if (proj == undefined){return;}

    this.projectField.text(proj.title)
                     .attr('data-value', proj._id)
                     .css('text-align','center')
                     .css('color','white')
                     .css('font-weight','bold')
                     .css('border-style','none');

    this.projectField.animate({backgroundColor: OPTIONS.categories.getColorById(proj.categoryId)}, 500 );

    // Only execute when category field has been passed.
    this._updateCategoryField(proj.categoryId, true);

  }

  //------------------------ Form methods ------------------------//

  _closeForm(){
    //Remove all open ddm first.
    $('.ddm_Container').remove();

    this.form.remove();
  }

  _focusNameField(){
    this.nameField.focus();
    let fieldDom = this.nameField[0];
    SetCurlet.setEndOfContenteditable(fieldDom);
  }

};


//---------------------------- Utilities -----------------------//

function highlightIfDate(field) {

  let inputDate = new Date(field.val());

  if(isValidDate(inputDate)){
    field.addClass('recognized_dueDate');
    field.css({'background-color':'#f4f4f4'});
  }else{
    field.removeClass('recognized_dueDate');
    field.css({'background-color':'white'});
  }
}

function isValidDate(date) {
  return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}
