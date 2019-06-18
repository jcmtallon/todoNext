/*jshint esversion: 9 */
const OPTIONS = require('./../optionHandler/OptionHandler');
const Form = require('./../forms/form');
const Habit = require('./habit');
const DropDownMenu = require('./../forms/dropDownMenu');
const icons = require('./../icons/icons.js');
const colors = require('./../selectables/colors');
const hourOptions = require('./../selectables/hours');
const urgencyLevels = require('./../selectables/urgencyLevels');


// Represents the 3 drop down menus in the form.
let _hourDDM;
let _catDDM;
let _urgDDM;


module.exports = class AddHabitForm extends Form{
  constructor(habitPage, preloadedHab){
  super();

  _catDDM = new DropDownMenu(OPTIONS.categories.getCategories());
  _urgDDM = new DropDownMenu(urgencyLevels);
  _hourDDM = new DropDownMenu(hourOptions);

  // Reference to the project page so we can request it
  // to add and update categories.
  this.habitPage = habitPage;

  // Chr limit for different fields
  this.titleChrLimit = 60;
  this.daysChrLimit = 3;

  // If an existing project was passed, adds the project
  // data to the form fields.
  this.preloadedHab = preloadedHab || '';

  _catDDM.on('restoreShortcuts', () => this.setFormShortcuts());
  _catDDM.on('optionWasSelected', (selection) => updateCategoryField(this.catPickField, selection));
  _catDDM.on('focusNextField', (index) => {
    setTimeout(() => {this.urgencyField.focus();}, 100);
  });

  _urgDDM.on('restoreShortcuts', () => this.setFormShortcuts());
  _urgDDM.on('optionWasSelected', (selection) => updateField(this.urgencyField, selection));
  _urgDDM.on('focusNextField', (index) => {
    setTimeout(() => {this.hourPickField.focus();}, 100);
  });

  _hourDDM.on('restoreShortcuts', () => this.setFormShortcuts());
  _hourDDM.on('optionWasSelected', (selection) => updateField(this.hourPickField, selection));
  _hourDDM.on('focusNextField', (index) => this.descriptionField.focus());
  }


  /**
   * Builds form with all its elements and events and appends
   * the form to the document;
   */
  displayForm(){

    // Changes applied to the app document.
    this.removeGlobalShortcuts();

    // Form title text and icon
    let titleText = (this.preloadedHab == '') ? 'Add a new habit' : 'Edit this habit';
    let titleIcon = icons.habits('#1551b5');
    this.header = this.buildHeader(titleText, titleIcon);

    // Form controllers
    this.nameField = buildNameField(this.titleChrLimit);
    this.frequencyField = buildFrequencyField(this.daysChrLimit);
    this.catPickField = buildCatPickField();
    this.hourPickField = buildHourPickField();
    this.urgencyField = buildUrgencyPickField();
    this.descriptionField = buildDescriptionField();
    this.saveButton = buildSaveButton(this);
    this.cancelButton = buildCancelButton(this);

    // Put form together
    this.bodyRows = [];
    this.bodyRows.push(buildNameAndFrequencyRow(this.nameField, this.frequencyField));
    this.bodyRows.push(buildOptionRow(this.catPickField,
                                        this.hourPickField,
                                        this.urgencyField));
    this.bodyRows.push(buildDescriptionRow(this.descriptionField));
    this.bodyRows.push(buildButonRow(this.saveButton,
                                     this.cancelButton));
    this.body = this.buildBody(this.bodyRows);
    this.form = this.buildForm(this.header,
                               this.body);

    // Adds form to document.
    this.setFormShortcuts();
    $(document.body).append(this.form);

    // this.inputPreloadedProject();

    this.nameField.focus();
  }



  /**
   * Inputs category deets into user fields
   * if a category was preloaded with the
   * constructor first.
   */
  inputPreloadedProject(){
    if (this.preloadedProj!=''){

      this.nameField.text(this.preloadedProj.title);

      // Category pick field only accepts cat titles, so
      // we have to find the corresponding title for the
      // given category ID first.
      let cats = OPTIONS.categories.getCategories();
      let catTitle;

      if (this.preloadedProj.categoryId!=''){
        let catObj = cats.find (obj => {return obj._id == this.preloadedProj.categoryId;});
        if (catObj != undefined){catTitle = catObj.title;}
      }

      if (catTitle != undefined){updateCategoryField(this.catPickField, catTitle);}

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
      return true;
  }


  /**
   * Returns a category object with all the user input.
   */
  getProjectData(preProj){
    let selectedCat = this.catPickField.attr('data-value');
    let catId ='';
    let cats = OPTIONS.categories.getCategories();
    if (selectedCat!=''){
      let catObj = cats.find (obj => {
        return obj.title == selectedCat;
      });
      catId = catObj._id;
    }

    let isLearning = this.learningField.attr('data-value');

    let newProj = new Project();
    newProj.title = this.nameField.text();
    newProj.categoryId = catId;
    newProj.description = this.descriptionField.text();
    newProj.deadline = (preProj !== undefined) ? preProj.deadline : undefined;
    newProj.isLearning = isLearning;
    newProj.completedTaskNb = (preProj !== undefined) ? preProj.completedTaskNb : 0;
    newProj.totalTaskNb = (preProj !== undefined) ? preProj.totalTaskNb : 0;
    newProj.id= (preProj !== undefined) ? preProj.id : undefined;

    return newProj;
  }
};

//--------------------------Build fields ----------------------//


function buildNameField(chrLimit) {
  let field;
  field = $('<div>', {class: 'form_textInputField'});
  field.attr('placeholder','Project name...');
  field.attr('contenteditable','true');
  field.attr('autocomplete','off');
  field.attr('tabindex','1');
  field.css('cursor','text');
  let fieldWhLimit = addCharacterLimitEvent(field, chrLimit);
  return fieldWhLimit;
}

function buildFrequencyField(chrLimit) {
  let field;
  field = $('<div>', {class: 'form_textInputField'});
  field.attr('placeholder','N Days');
  field.attr('contenteditable','true');
  field.attr('autocomplete','off');
  field.attr('tabindex','2');
  field.css('cursor','text');
  let fieldWhLimit = addCharacterLimitEvent(field, chrLimit);
  let fieldWhHightlights = addHightlightWhenNumber(fieldWhLimit);
  return fieldWhHightlights;
}

function buildCatPickField() {
  let textHolder = 'Link to a category...';
  let fieldId = 'catSelectDdm';
  let tabIndex = '3';
  let field = _catDDM.createDdmWithColors(textHolder, fieldId, tabIndex);
  return field;
}

function buildHourPickField() {
  let textHolder = 'Duration...';
  let fieldId = 'hourSelectDdm';
  let tabIndex = '5';
  let field = _hourDDM.createDdmWithIcons(textHolder, fieldId, tabIndex);
  return field;
}

function buildUrgencyPickField() {
  let textHolder = 'Urgency...';
  let fieldId = 'urgencySelectDdm';
  let tabIndex = '4';
  let field = _urgDDM.createDdmWithIcons(textHolder, fieldId, tabIndex);
  return field;
}

function buildDescriptionField() {
  let field;
  field = $('<div>', {class: 'form_textInputField'});
  field.attr('placeholder','What are your goals for this category?...');
  field.attr('contenteditable','true');
  field.attr('autocomplete','off');
  field.attr('tabindex','6');
  field.css('min-height','60px');
  return field;
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

function buildNameAndFrequencyRow(name, frequency){
  let trow = $('<tr>',{});
  trow.append(buildCategoryNameCol(name));
  trow.append(buildFrequencyCol(frequency));
  return trow;
}

function buildOptionRow(catPick, hourPick, urgencyPick) {
  let trow = $('<tr>',{});
  trow.append(buildCatPickCol(catPick))
      .append(buildUrgencyCol(urgencyPick))
      .append(buildHourCol(hourPick));
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

function buildFrequencyCol(frequency){
  let col;
  col = $('<td>', {});
  col.css('padding', '6px 6px 6px 6px');
  col.css('min-width','70px');
  col.css('text-align','center');
  col.append(frequency);
  return col;
}

function buildCatPickCol(field){
  let col;
  col = $('<td>', {});
  col.css('padding', '0px 0px 6px 6px');
  col.css('min-width','38px');
  col.css('width','100%');
  col.append(field);
  return col;
}

function buildHourCol(field) {
  let col;
  col = $('<td>',{});
  col.css('padding', '0px 6px 6px 0px');
  col.css('min-width', '121px');
  col.append(field);
  return col;
}

function buildUrgencyCol(field) {
  let col;
  col = $('<td>',{});
  col.css('padding', '0px 6px 6px 6px');
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





//-------------------Listener events ------------------//


function updateCategoryField(field, selection){

  let cats = OPTIONS.categories.getCategories();
  let catObj = cats.find (obj => {
    return obj.title == selection;
  });

  if (catObj == undefined){return;}

  field.text(selection);
  field.attr('data-value', selection);
  field.css('text-align','center');
  field.css('color','white');
  field.css('font-weight','bold');
  field.css('border-style','none');

  field.animate({backgroundColor: catObj.color}, 500 );
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



function addHightlightWhenNumber(field) {

  function recognizeDate() {
    let input = field.text();
    if(!isNaN(input) && input<365 && input>0){
      field.addClass('recognized_dueDate');
    }else{
      field.removeClass('recognized_dueDate');
    }
  }

  field.on("input", () => recognizeDate());
  field.on("change", () => recognizeDate());

  return field;

}
