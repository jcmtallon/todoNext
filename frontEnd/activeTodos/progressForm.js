/*jshint esversion: 6 */
const Form = require('./../forms/form');
const Todo = require('./Todo');
const icons = require('./../icons/icons.js');



module.exports = class ProgressForm extends Form{
  constructor(saveCallback, todo){
  super();

  this.saveCallback = saveCallback;
  this.todo = todo;

  // Tells the Form parent to center the form vertically.
  this.isCentered = true;
  this.formWidth = 390;
  }


  /**
   * Builds form with all its elements and events and appends
   * the form to the document;
   */
  displayForm(){

    // Changes applied to the app document.
    this.removeGlobalShortcuts();

    // Form title text and icon
    let titleText = 'Add your progress!';
    let titleIcon = icons.hours('#1551b5');
    this.header = this.buildHeader(titleText, titleIcon);

    // Form controllers
    this.taskTitleLabel = buildTaskTitleLabel(this.todo.title);
    this.minusButton = buildMinusButton();
    this.plusButton = buildPlusButton();
    this.saveButton = buildSaveButton(this);

    // Put form together
    this.bodyRows = [];
    this.bodyRows.push(buildTitleLabelRow(this.taskTitleLabel));
    this.bodyRows.push(buildProgressBarRow());
    this.bodyRows.push(buildButonRow(this.minusButton,
                                     this.plusButton,
                                     this.saveButton));

    this.body = this.buildBody(this.bodyRows);
    this.form = this.buildForm(this.header,
                               this.body);

   // Activates shortcuts.
   // Short time out to make sure that this is applied
   // after the context menu has removed the menu
   // shortcuts (TODO: improve this.)
   setTimeout( () => {this.setFormShortcuts();}, 100);

   // Adds form to document.
    $(document.body).append(this.form);

    // Input loaded note data.
    // this.inputTodoData();
    this.saveButton.focus();

  }



  /**
   * Inputs loaded todo note data into form note field.
   */
  inputTodoData(){
    // if (this.todo.notes!=null || this.todo.notes!=undefined){
    //   this.noteField.text(this.todo.notes);
    // }
  }


  /**
   * Updates todo with new note data, closes form and
   * calls callback (saves new todo into option list
   * and refreshes page).
   */
  save(){
    // let isValidInput = this.checkFormInput();
    // if (isValidInput){
    //   this.todo.notes = this.noteField.text();
    //   this.removeForm();
    //   this.saveCallback(this.todo);
    // }
  }

  /**
   * Returns a true value after securing that there is
   * an internet connection..
   */
  checkFormInput(){
      // Abort if no internet connection.
      if(!navigator.onLine){
        this.displayErrorMsg('Failed to add item. \nCheck if there is an internet connection.','error','down');
        return;
      }

      return true;
  }
};

//--------------------------Build fields ----------------------//

function buildTaskTitleLabel(title) {
  let label;
  label = $('<div>', {});
  label.text('To do:  ' + title);
  label.css({'text-align':'left',
             'font-weight':'bold',
             'font-size':'14px',
             'white-space':'pre-wrap',
             'overflow':'hidden',
             'text-overflow':'ellipsis'});
  return label;
}


function buildMinusButton() {
  let btn;
  btn = $('<span>', {text:'-', class:'blue_botton'});
  btn.attr('tabindex','1');
  btn.css({'float':'left',
           'margin-right':'4px',
           'padding':'3px 9px 4px 9px'});
  // let btnWithEvent = loadSaveEvent(btn, formObj);
  return btn;
}

function buildPlusButton() {
  let btn;
  btn = $('<span>', {text:'+', class:'blue_botton'});
  btn.attr('tabindex','2');
  btn.css({'float':'left',
           'padding':'3px 9px 4px 9px'});
  // let btnWithEvent = loadSaveEvent(btn, formObj);
  return btn;
}


function buildSaveButton(formObj) {
  let btn;
  btn = $('<span>', {text:'Save', class:'blue_botton'});
  btn.attr('tabindex','3');
  btn.css({'float':'right'});
  btn.css('width','52px'); //So it displays the same size as cancelbtn
  let btnWithEvent = loadSaveEvent(btn, formObj);
  return btnWithEvent;
}




//--------------------------Build body rows ------------------//

function buildTitleLabelRow(label) {
  let trow = $('<tr>',{});
  trow.append(buildTitleLabelCol(label));
  return trow;
}

function buildProgressBarRow() {
  let trow = $('<tr>',{});
  trow.append(buildProgressBarCol());
  return trow;
}

function buildButonRow(minusBtn, plusBtn, saveBtn) {
  let trow = $('<tr>',{});
  trow.append(buildLowerButtonCol(minusBtn, plusBtn, saveBtn));
  return trow;
}

function buildTitleLabelCol(label) {
  let col;
  col = $('<td>', {});
  col.css({'width':'100%'});
  col.append(label);
  return col;
}

function buildProgressBarCol(){
  let temp = $('<div>',{text:'Test'});
  let col;
  col = $('<td>', {});
  col.css('width', '100%');
  col.append(temp);
  return col;
}

function buildLowerButtonCol(minusBtn, plusBtn, saveBtn){
  let col;
  col = $('<td>', {});
  col.css('width', '100%');
  col.css('padding', '4px 0px 0px');
  col.css('text-align', 'center');
  col.append(minusBtn)
     .append(plusBtn)
     .append(saveBtn);
  return col;
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
