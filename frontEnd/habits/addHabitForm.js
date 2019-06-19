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

    this.inputPreloadedHabit();

    this.nameField.focus();
  }



  /**
   * Inputs category deets into user fields
   * if a category was preloaded with the
   * constructor first.
   */
  inputPreloadedHabit(){
    if (this.preloadedHab!=''){
      this.nameField.text(this.preloadedHab.title);

      // Category pick field only accepts cat titles, so
      // we have to find the corresponding title for the
      // given category ID first.
      let cats = OPTIONS.categories.getCategories();
      let catTitle;
      if (this.preloadedHab.categoryId!=''){
        let catObj = cats.find (obj => {return obj._id == this.preloadedHab.categoryId;});
        if (catObj != undefined){catTitle = catObj.title;}}
      if (catTitle != undefined){updateCategoryField(this.catPickField, catTitle);}

      updateField(this.urgencyField, this.preloadedHab.urgency);
      updateField(this.hourPickField, this.preloadedHab.hours);

      this.descriptionField.text(this.preloadedHab.description);
      this.frequencyField.text(this.preloadedHab.frequency);
      this.frequencyField.addClass('recognized_dueDate');
      this.frequencyField.css('background-color','#f4f4f4');
    }
  }


  /**
   * Sends the input back to the habit page
   * inside a habit object after validating the
   * form input.
   */
  save(){
    let isValidInput = this.checkFormInput();
    if (isValidInput){

      if(this.preloadedHab == ''){
        let newHab = this.getHabitData();
        this.removeForm();
        this.habitPage.addNewHabit(newHab);

      } else {
        let preHab = this.getHabitData(this.preloadedHab);
        this.removeForm();
        this.habitPage.updateHabit(preHab);
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
        this.displayErrorMsg('Habit name cannot be empty.','error','down');
        return;
      }

      // Abort if no valid number of days
      let freqInput = this.frequencyField.text();
      if(freqInput==''){
        this.displayErrorMsg('Number of days cannot be empty.','error','down');
        return;
      }
      if(isNaN(freqInput)){
        this.displayErrorMsg('Number of days must be a number.','error','down');
        return;
      }
      if(freqInput>365 || freqInput<0){
        this.displayErrorMsg('Number of days must be between 1 and 354.','error','down');
        return;
      }

      // Abort if no urgency selected
      if(this.urgencyField.attr('data-value') == ''){
        this.displayErrorMsg('Urgency field cannot be empty.','error','down');
        return;
      }

      // About if no duration selected
      if(this.hourPickField.attr('data-value') == ''){
        this.displayErrorMsg('Duration field cannot be empty.','error','down');
        return;
      }

      return true;
  }


  /**
   * Returns a habit object with all the user input.
   */
  getHabitData(preHab){
    let selectedCat = this.catPickField.attr('data-value');
    let catId ='';
    let cats = OPTIONS.categories.getCategories();
    if (selectedCat!=''){
      let catObj = cats.find (obj => {
        return obj.title == selectedCat;
      });
      catId = catObj._id;
    }

    let newHab = new Habit();
    if(preHab!=undefined){newHab.id = preHab.id;}
    newHab.title = this.nameField.text();
    newHab.categoryId = catId;
    newHab.frequency = this.frequencyField.text();
    newHab.hours = this.hourPickField.attr('data-value');
    newHab.urgency = this.urgencyField.attr('data-value');
    newHab.description = this.descriptionField.text();
    newHab.nextTaskDate = new Date();
    newHab.isActive = true;

    return newHab;
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
  field.attr('placeholder','What are your goals for this habit?...');
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
      field.css('background-color','#f4f4f4');
    }else{
      field.removeClass('recognized_dueDate');
      field.css('background-color','white');
    }
  }

  field.on("input", () => recognizeDate());
  field.on("change", () => recognizeDate());

  return field;

}
