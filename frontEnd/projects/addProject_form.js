/*jshint esversion: 6 */
const OPTIONS = require('./../optionHandler/OptionHandler');
const Form = require('./../forms/form');
const Project = require('./Project');
const DropDownMenu = require('./../forms/dropDownMenu');
const BooleanButton = require('./../forms/booleanButton');
const SetCurlet = require('./../otherMethods/setCaret');
const icons = require('./../icons/icons.js');
const colors = require('./../selectables/colors');
const moment = require('moment');


// Represent the category picker field drop down menu.
let _catDDM;

// Reprensets the boolean field.
let _btnObj;


module.exports = class AddProjectForm extends Form{
  constructor(projectPage, preloadedProj){
  super();

  _catDDM = new DropDownMenu(OPTIONS.categories.getCategories());

  // Chr limit for project field name.
  this.projNameChrLimit = 30;

  // Reference to the project page so we can request it
  // to add and update categories.
  this.projectPage = projectPage;

  // If an existing project was passed, adds the project
  // data to the form fields.
  this.preloadedProj = preloadedProj || '';


  _catDDM.on('restoreShortcuts', () => this.setFormShortcuts());
  _catDDM.on('optionWasSelected', (selection) => updateCategoryField(this.catPickField, selection));
  _catDDM.on('focusNextField', (index) => this.learningField.focus());
  }


  /**
   * Builds form with all its elements and events and appends
   * the form to the document;
   */
  displayForm(){

    // Changes applied to the app document.
    this.removeGlobalShortcuts();

    // Form title text and icon
    let titleText = (this.preloadedProj == '') ? 'Add a new project' : 'Edit this project';
    let titleIcon = icons.projectsActive();
    this.header = this.buildHeader(titleText, titleIcon);

    // Form controllers
    this.chrTotalTag = buildChrTotalField(this.projNameChrLimit);
    this.chrCountTag = buildChrCountField();
    this.nameField = buildNameField(this.projNameChrLimit,
                                    this.chrTotalTag,
                                    this.chrCountTag);
    this.deadline = buildDeadlineField();
    this.catPickField = buildCatPickField();
    this.learningField = buildLearningField();
    this.descriptionField = buildDescriptionField();
    this.saveButton = buildSaveButton(this);
    this.cancelButton = buildCancelButton(this);

    // Put form together
    this.bodyRows = [];
    this.bodyRows.push(buildNameAndColorRow(this.nameField,
                                            this.chrCountTag,
                                            this.chrTotalTag,
                                            this.deadline));
    this.bodyRows.push(buildCategoryRow(this.catPickField,
                                        this.learningField));
    this.bodyRows.push(buildDescriptionRow(this.descriptionField));
    this.bodyRows.push(buildButonRow(this.saveButton,
                                     this.cancelButton));
    this.body = this.buildBody(this.bodyRows);
    this.form = this.buildForm(this.header,
                               this.body);

    // Adds form to document.
    setTimeout( () => {this.setFormShortcuts();}, 100);

    $(document.body).append(this.form);

    this.inputPreloadedProject();

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
  inputPreloadedProject(){
    if (this.preloadedProj!=''){

      this.nameField.text(this.preloadedProj.title);

      updateCategoryField(this.catPickField, this.preloadedProj.categoryId);

      if(this.preloadedProj.deadline!=undefined &&
        this.preloadedProj.deadline!=''){
        let dueTo = moment(this.preloadedProj.deadline).format("D MMM, YY");
        this.deadline.val(dueTo);
        this.deadline.addClass('recognized_dueDate');
        this.deadline.css('background-color','#f4f4f4');
      }

      if (this.preloadedProj.isLearning){_btnObj.toogleValue(true);}
      this.descriptionField.text(this.preloadedProj.description);
    }
  }


  /**
   * Sends the input back to the category categoryPage
   * inside a category object after validating the
   * form input.
   */
  save(){
    let isValidInput = this.checkFormInput();
    if (isValidInput){

      if(this.preloadedProj == ''){
        let newProj = this.getProjectData();
        this.removeForm();
        this.projectPage.addNewProject(newProj);

      } else {
        let preProj = this.getProjectData(this.preloadedProj);
        this.removeForm();
        this.projectPage.updateProject(preProj);
      }
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
        this.displayErrorMsg('Category name cannot be empty.','error','down');
        return;
      }

      // Abort if no valid number of days
      let dueToInput = this.deadline.val();
      if(dueToInput!='' && !isValidDate(new Date(dueToInput))){
        this.displayErrorMsg('Due date value must be a valid date.','error','down');
        return;
      }

      //Abort if tried to change the category
      // and at least one project task has been already
      // completed.
      let catId = this.catPickField.attr('data-value');
      if (this.preloadedProj!='' &&
          this.preloadedProj.completedTaskNb > 0 &&
          this.preloadedProj.categoryId != catId){
            this.displayErrorMsg('Cannot change category once one or more task projects have been completed.','error','down');
            return;
          }

      return true;
  }


  /**
   * Returns a category object with all the user input.
   */
  getProjectData(preProj){

    let catId = this.catPickField.attr('data-value');
    let cat = OPTIONS.categories.getCategoryById(catId);

    let isLearning = this.learningField.attr('data-value');

    let newProj = new Project();
    newProj.title = this.nameField.text();
    newProj.categoryId = (cat!=undefined) ? cat._id :'';
    newProj.description = this.descriptionField.text();
    newProj.deadline = new Date(this.deadline.val());
    newProj.isLearning = isLearning;
    newProj.completedTaskNb = (preProj !== undefined) ? preProj.completedTaskNb : 0;
    newProj.totalTaskNb = (preProj !== undefined) ? preProj.totalTaskNb : 0;
    newProj.id= (preProj !== undefined) ? preProj.id : undefined;

    return newProj;
  }
};

//--------------------------Build fields ----------------------//

function buildChrTotalField(chrLimit) {
  let tag;
  tag = $('<span>', {text:'/'+chrLimit});
  tag.css('color','#6d6c6c');
  tag.css('font-size','12px');
  return tag;
}

function buildChrCountField() {
  let tag;
  tag = $('<span>', {text:'0'});
  tag.css('color','#6d6c6c');
  tag.css('font-size','11px');
  return tag;
}

function buildNameField(chrLimit, totalTag, countTag) {
  let field;
  field = $('<div>', {class: 'form_textInputField'});
  field.attr('placeholder','Project name...');
  field.attr('contenteditable','true');
  field.attr('autocomplete','off');
  field.attr('tabindex','1');
  field.css('cursor','text');
  let fieldWhLimit = addCharacterLimitEvent(field, chrLimit);
  let fieldWhEvent = updateChrCounter(fieldWhLimit, countTag, totalTag, chrLimit);
  return fieldWhEvent;
}

function buildDeadlineField() {
  let field;
  field = $('<input>', {class: 'form_textInputField'});
  field.attr('placeholder','Due to...');
  field.attr('autocomplete','off');
  field.attr('tabindex','2');
  field.css({'width':'90px','text-align':'center'});

  let fieldWhEvents = setDueDateEvents(field);
  return fieldWhEvents;
}

function buildCatPickField() {
  let textHolder = 'Link to a category...';
  let fieldId = 'catSelectDdm';
  let tabIndex = '3';
  let field = _catDDM.createDdmWithColors(textHolder, fieldId, tabIndex);
  return field;
}

function buildLearningField() {
  _btnObj = new BooleanButton('Learning', icons.learning);
  let btn = _btnObj.createButtonWithIcon(false);
  btn.attr('tabindex','4');
  return btn;
}

function buildDescriptionField() {
  let field;
  field = $('<div>', {class: 'form_textInputField'});
  field.attr('placeholder','What are your goals for this category?...');
  field.attr('contenteditable','true');
  field.attr('autocomplete','off');
  field.attr('tabindex','5');
  field.css('min-height','60px');
  return field;
}

function buildSaveButton(formObj) {
  let btn;
  btn = $('<span>', {text:'Save', class:'blue_botton'});
  btn.attr('tabindex','6');
  btn.css('margin-right','9px');
  btn.css('width','52px'); //So it displays the same size as cancelbtn
  let btnWithEvent = loadSaveEvent(btn, formObj);
  return btnWithEvent;
}

function buildCancelButton(formObj) {
  let btn;
  btn = $('<span>', {text:'Cancel', class:'blue_botton'});
  btn.attr('tabindex','7');
  let btnWithEvent = loadCancelEvent(btn, formObj);
  return btnWithEvent;
}




//--------------------------Build body rows ------------------//

function buildNameAndColorRow(name, chrCount, totalCount, deadline) {
  let trow = $('<tr>',{});
  trow.append(buildCategoryNameCol(name));
  trow.append(buildCategoryNameChrCountCol(chrCount, totalCount));
  trow.append(buildDueToCol(deadline));
  return trow;
}

function buildCategoryRow(catPick, learningBtn) {
  let trow = $('<tr>',{});
  trow.append(buildCatPickCol(catPick))
      .append(buildLearningBtnCol(learningBtn));
  return trow;
}

function buildDescriptionRow(description) {
  let trow = $('<tr>',{});
  trow.append(buildDescriptionCol(description));
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

function buildCategoryNameChrCountCol(chrCount, totalCount){
  let col;
  col = $('<td>', {});
  col.css('padding', '6px');
  col.css('min-width','38px');
  col.css('text-align','right');
  col.css('padding-right','15px');
  col.css('padding-left','0px');
  col.append(chrCount)
     .append(totalCount);
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
  col.css('padding', '0px 6px 6px 6px');
  col.css('min-width','38px');
  col.css('width','100%');
  col.append(field);
  return col;
}

function buildLearningBtnCol(field) {
  let col;
  col = $('<td>',{});
  col.css('padding', '0px 6px 6px 9px');
  col.css('min-width', '121px');
  col.append(field);
  return col;
}

function buildDescriptionCol(field){
  let col;
  col = $('<td>', {});
  col.css('width', '100%');
  col.css('padding', '0px 6px 6px');
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


function updateChrCounter(nameField, countTag, totalTag, limit){

  nameField.on('blur keyup paste input', (e) => {
    let chrNb = nameField.text().length;

    // Update character count tag.
    countTag.text(chrNb);

    // change counter color when reach max
    if (chrNb == limit){
      countTag.css('color','#1551b5');
      totalTag.css('color','#1551b5');
    }else {
      countTag.css('color','#6d6c6c');
      totalTag.css('color','#6d6c6c');
    }
  });
  return nameField;

}


//-------------------Listener events ------------------//


function updateCategoryField(field, optionId){

  let cat = OPTIONS.categories.getCategoryById(optionId);
  if (cat == undefined){return;}

  field.text(cat.title);
  field.attr('data-value', cat._id);
  field.css('text-align','center');
  field.css('color','white');
  field.css('font-weight','bold');
  field.css('border-style','none');

  field.animate({backgroundColor: cat.color}, 500 );
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
