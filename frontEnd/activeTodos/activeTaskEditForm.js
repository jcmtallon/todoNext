/*jshint esversion: 9 */
const OPTIONS = require('./../optionHandler/OptionHandler');
const Form = require('./../forms/form');
const Task = require('./Task');
const DropDownMenu = require('./../forms/dropDownMenu');
const BooleanButton = require('./../forms/booleanButton');
const SetCurlet = require('./../otherMethods/setCaret');
const icons = require('./../icons/icons.js');
const colors = require('./../selectables/colors');
const urgencyLevels = require('./../selectables/urgencyLevels');
const moment = require('moment');


// Represents the 3 drop down menus and one boolean btn in the form.
let _catDDM;
let _projDDM;
let _urgDDM;
let _btnObj;


module.exports = class EditActiveTaskForm extends Form{
  constructor(activeTaskPage, preloadedTask){
  super();

  _catDDM = new DropDownMenu(OPTIONS.categories.getCategories());
  _projDDM = new DropDownMenu(OPTIONS.projects.getProjectsWithColors());
  _urgDDM = new DropDownMenu(urgencyLevels);

  // Reference to the active task page so we can request it
  // to add and update active tasks.
  this.activeTaskPage = activeTaskPage;


  this.titleChrLimit = 300;

  // If an existing project was passed, adds the project
  // data to the form fields.
  this.preloadedTask = preloadedTask || '';

  _catDDM.on('restoreShortcuts', () => this.setFormShortcuts());
  _catDDM.on('optionWasSelected', (selection) => updateCategoryField(this.catPickField, selection, this.projectField));
  // _catDDM.on('focusNextField', (index) => {
  //   setTimeout(() => {this.urgencyField.focus();}, 100);
  // });

  _urgDDM.on('restoreShortcuts', () => this.setFormShortcuts());
  _urgDDM.on('optionWasSelected', (selection) => updateField(this.urgencyField, selection));
  // _urgDDM.on('focusNextField', (index) => {
  //   setTimeout(() => {this.projectField.focus();}, 100);
  // });

  _projDDM.on('restoreShortcuts', () => this.setFormShortcuts());
  _projDDM.on('optionWasSelected', (selection) => updateProjectField(this.projectField, selection, this.catPickField));
  // _projDDM.on('focusNextField', (index) => {
  //   setTimeout(() => {this.learningField.focus();}, 100);
  // });
  }


  /**
   * Builds form with all its elements and events and appends
   * the form to the document;
   */
  displayForm(){

    // Changes applied to the app document.
    this.removeGlobalShortcuts();

    // Form title text and icon
    let titleText = (this.preloadedTask == '') ? 'Add a new task' : 'Edit this task';
    let titleIcon = icons.activeTasks('#1551b5');
    this.header = this.buildHeader(titleText, titleIcon);

    // Form controllers
    this.nameField = buildNameField(this.titleChrLimit);
    this.dueToField = buildDueToField();
    this.catPickField = buildCatPickField();
    this.projectField = buildProjectField();
    this.urgencyField = buildUrgencyPickField();
    this.learningField = buildLearningField();
    this.saveButton = buildSaveButton(this);
    this.cancelButton = buildCancelButton(this);

    // Put form together
    this.bodyRows = [];
    this.bodyRows.push(buildNameAndDueTo(this.nameField, this.dueToField));
    this.bodyRows.push(buildCatUrgRow(this.catPickField, this.urgencyField));
    this.bodyRows.push(buildOptionRow(this.projectField, this.learningField));
    this.bodyRows.push(buildButonRow(this.saveButton,
                                     this.cancelButton));
    this.body = this.buildBody(this.bodyRows);
    this.form = this.buildForm(this.header,
                               this.body);

    // Adds form to document.
    setTimeout( () => {this.setFormShortcuts();}, 100);
    $(document.body).append(this.form);

    this.inputPreloadedHabit();
    this.focusNameField();
  }


  /**
   * Set focus onto nameField placing the curlet
   * at the end of the text.
   */
  focusNameField(){
    this.nameField.focus();
    let fieldDom = this.nameField[0];
    SetCurlet.setEndOfContenteditable(fieldDom);
  }


  /**
   * Inputs category deets into user fields
   * if a category was preloaded with the
   * constructor first.
   */
  inputPreloadedHabit(){
    if (this.preloadedTask!=''){

      this.nameField.text(this.preloadedTask.title);

      let dueTo = moment(this.preloadedTask.dueTo).format("D MMM, YY");
      this.dueToField.val(dueTo);
      this.dueToField.addClass('recognized_dueDate');
      this.dueToField.css('background-color','#f4f4f4');

      updateCategoryField(this.catPickField, this.preloadedTask.categoryId);
      updateProjectField(this.projectField, this.preloadedTask.projectId);
      updateField(this.urgencyField, this.preloadedTask.urgency);
      if (this.preloadedTask.isLearning){_btnObj.toogleValue(true);}

    }
  }


  /**
   * Sends the input back to the active tas page
   * inside a task object after validating the
   * form input.
   */
  save(){
    let isValidInput = this.checkFormInput();
    if (isValidInput){
      let preTask = this.getTaskData(this.preloadedTask);
      this.removeForm();
      this.activeTaskPage.updateActiveTask(preTask);
    }
  }

  /**
   * Returns a true value after securing that there is
   * an internet connection and that at least the category
   * name has been introduced.
   */
  checkFormInput(){
      // Abort if no internet connection.
      if(!navigator.onLine){
        this.displayErrorMsg('Failed to add item. \nCheck if there is an internet connection.','error','down');
        return;
      }

      // Abort if no name.
      if (this.nameField.text()==''){
        this.displayErrorMsg('Habit name cannot be empty.','error','down');
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


  /**
   * Returns a task object with all the user input.
   */
  getTaskData(preTask){

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
};

//--------------------------Build fields ----------------------//


function buildNameField(chrLimit) {
  let field;
  field = $('<div>', {class: 'form_textInputField'});
  field.attr('placeholder','Habit name...');
  field.attr('contenteditable','true');
  field.attr('autocomplete','off');
  field.attr('tabindex','1');
  field.css('cursor','text');
  let fieldWhLimit = addCharacterLimitEvent(field, chrLimit);
  return fieldWhLimit;
}

function buildDueToField(chrLimit) {
  let field;
  field = $('<input>', {class: 'form_textInputField'});
  field.attr('placeholder','Due to...');
  field.attr('autocomplete','off');
  field.attr('tabindex','2');
  field.css({'width':'90px',
            'text-align':'center'});

  let fieldWhEvents = setDueDateEvents(field);
  return fieldWhEvents;
}

function buildCatPickField() {
  let textHolder = 'Select a category...';
  let fieldId = 'catSelectDdm';
  let tabIndex = '3';
  let field = _catDDM.createDdmWithColors(textHolder, fieldId, tabIndex);
  return field;
}

function buildUrgencyPickField() {
  let textHolder = 'Urgency...';
  let fieldId = 'urgencySelectDdm';
  let tabIndex = '4';
  let field = _urgDDM.createDdmWithIcons(textHolder, fieldId, tabIndex);
  return field;
}

function buildProjectField() {
  let textHolder = 'Select a project...';
  let fieldId = 'projSelectDdm';
  let tabIndex = '5';
  let field = _projDDM.createDdmWithColors(textHolder, fieldId, tabIndex);
  return field;
}

function buildLearningField() {
  _btnObj = new BooleanButton('Learning', icons.learning);
  let btn = _btnObj.createButtonWithIcon(false);
  btn.attr('tabindex','6');
  return btn;
}

function buildSaveButton(formObj) {
  let btn;
  btn = $('<span>', {text:'Save', class:'blue_botton'});
  btn.attr('tabindex','7');
  btn.css('margin-right','9px');
  btn.css('width','52px'); //So it displays the same size as cancelbtn
  let btnWithEvent = loadSaveEvent(btn, formObj);
  return btnWithEvent;
}

function buildCancelButton(formObj) {
  let btn;
  btn = $('<span>', {text:'Cancel', class:'blue_botton'});
  btn.attr('tabindex','8');
  let btnWithEvent = loadCancelEvent(btn, formObj);
  return btnWithEvent;
}




//--------------------------Build body rows ------------------//

function buildNameAndDueTo(name, dueTo){
  let trow = $('<tr>',{});
  trow.append(buildCategoryNameCol(name));
  trow.append(buildDueToCol(dueTo));
  return trow;
}

function buildCatUrgRow(catPick, urgency) {
  let trow = $('<tr>',{});
  trow.append(buildCatPickCol(catPick))
      .append(buildUrgencyCol(urgency));
  return trow;
}

function buildOptionRow(projPick, learning) {
  let trow = $('<tr>',{});
  trow.append(buildProjPickCol(projPick))
      .append(buildLearningBtnCol(learning));
  return trow;
}

function buildButonRow(saveBtn, cancelBtn) {
  let trow = $('<tr>',{});
  trow.append(buildLowerButtonCol(saveBtn, cancelBtn));
  return trow;
}





//-------------------Build Name and Color Row ------------------//

function buildCategoryNameCol(field){
  let col;
  col = $('<td>', {});
  col.css('width', '100%');
  col.css('padding', '6px');
  col.css('padding-right','1px');
  col.append(field);
  return col;
}

function buildDueToCol(dueTo){
  let col;
  col = $('<td>', {});
  col.css('padding', '6px 6px 6px 6px');
  col.css('min-width','70px');
  col.css('text-align','center');
  col.append(dueTo);
  return col;
}

function buildCatPickCol(field){
  let col;
  col = $('<td>', {});
  col.css('padding', '0px 0px 6px 6px');
  col.css('min-width','38px');
  col.css('width','50%');
  col.append(field);
  return col;
}

function buildProjPickCol(field) {
  let col;
  col = $('<td>', {});
  col.css('padding', '0px 0px 6px 6px');
  col.css('min-width','50%');
  col.css('width','100%');
  col.append(field);
  return col;
}


function buildUrgencyCol(field) {
  let col;
  col = $('<td>',{});
  col.css('padding', '0px 6px 6px 6px');
  col.css('width', '30%');
  col.append(field);
  return col;
}

function buildLearningBtnCol(field) {
  let col;
  col = $('<td>',{});
  col.css('padding', '0px 6px 6px 6px');
  col.css('width', '120px;');
  col.append(field);
  return col;
}

function buildLowerButtonCol(saveBtn, cancelBtn){
  let col;
  col = $('<td>', {});
  col.css('width', '100%');
  col.css('padding', '12px 6px 0px');
  col.css('text-align', 'right');
  col.append(saveBtn)
     .append(cancelBtn);
  return col;
}





//-------------------Listener events ------------------//


function updateCategoryField(field, optionId, projField){

  let cat = OPTIONS.categories.getCategoryById(optionId);

  if (cat == undefined){
    field.text('Select a category...');
    field.attr('data-value', '');
    field.css('text-align','left');
    field.css('color','grey');
    field.css('font-weight','normal');
    field.css('border-style','solid');
    field.css('background-color','white');
    return;
  }

  field.text(cat.title);
  field.attr('data-value', cat._id);
  field.css('text-align','center');
  field.css('color','white');
  field.css('font-weight','bold');
  field.css('border-style','none');

  field.animate({backgroundColor: cat.color}, 500 );

  // If projectField was received, it means we should restart
  // the value and look in any case.
  if(projField!=undefined){
    projField.text('Select a project...');
    projField.attr('data-value', '');
    projField.css('text-align','left');
    projField.css('color','grey');
    projField.css('background-color','white');
    projField.css('font-weight','normal');
    projField.css('border-style','solid');
  }
}


function updateProjectField(field, optionId, catField) {

  let proj = OPTIONS.projects.getProjectById(optionId);

  if (proj == undefined){return;}

  field.text(proj.title);
  field.attr('data-value', proj._id);
  field.css('text-align','center');
  field.css('color','white');
  field.css('font-weight','bold');
  field.css('border-style','none');

  field.animate({backgroundColor: OPTIONS.categories.getColorById(proj.categoryId)}, 500 );

  // Only execute when category field has been passed.
  if (catField!=undefined){
    updateCategoryField(catField, proj.categoryId);
  }
}


function updateField(field, selection) {
  field.text(selection);
  field.attr('data-value', selection);
  field.css('text-align','center');
  field.css('color','#1551b5');
  field.css('font-weight','bold');
  field.css('background-color','#f4f4f4');
}



//--------------------------Button Events ------------------//

function loadCancelEvent(btn, formObj){
  btn.on('click',(e) => {
    e.stopPropagation();
    formObj.removeForm();
  });
  return btn;
}

function loadSaveEvent(btn, formObj){
  btn.on('click',(e) => {
    e.stopPropagation();
    formObj.save();
  });
  return btn;
}


//-------------------Set field events ------------------//

function addCharacterLimitEvent(field, chrLimit){
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



function setDueDateEvents(field) {

  // Set jquery ui datapicker
  field.datepicker({ minDate: 0, maxDate: "+5Y +10D" });
  field.datepicker( "option", "dateFormat","d M, y");

  field.on("input", () => highlightIfDate(field));
  field.on("change", () => highlightIfDate(field));

  return field;

}

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
