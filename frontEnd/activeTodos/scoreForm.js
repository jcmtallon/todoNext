/*jshint esversion: 6 */
const Form = require('./../forms/form');
const icons = require('./../icons/icons.js');



module.exports = class ScoreForm extends Form{
  constructor(saveCallback, cancelCallback, todo){
  super();

  this.saveCallback = saveCallback;
  this.cancelCallback = cancelCallback;
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
    let titleText = 'Rate this task!';
    let titleIcon = icons.star('#1551b5');
    this.header = this.buildHeader(titleText, titleIcon);

    // Form controllers
    this.taskTitleLabel = buildTaskTitleLabel(this.todo.title);
    this.starRow = buildStarRow();

    // Put form together
    this.bodyRows = [];
    this.bodyRows.push(buildTitleLabelRow(this.taskTitleLabel));
    this.bodyRows.push(this.progressBarRow);

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
  }


  /**
   * Updates todo with new note data, closes form and
   * calls callback (saves new todo into option list
   * and refreshes page).
   */
  save(){
    // let isValidInput = this.checkFormInput();
    // if (isValidInput){
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

//-----------------------Build progress bar -------------------//


function buildProgressBar(todo, btnAction) {

  let progress = todo.progress;
  let total = Number(todo.hours);

  let firstRow = $('<tr>');
  let secondRow = $('<tr>');

  for(let i=1; i<total+1; i++){
    firstRow.append(buildProgressBtn(i, progress, total, btnAction));
    secondRow.append(buildProgressLabel(i, progress, btnAction));
  }

  let body;
  body = $('<tbody>');
  body.css('width','100%');
  body.append(firstRow).append(secondRow);

  let table;
  table = $('<table>', {cellspacing:0,cellpadding:0});
  table.css({'width':'100%',
            'margin-top':'20px',
             'margin-bottom': '20px'});
  table.append(body);

  return table;

}



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



//--------------------------Build body rows ------------------//

function buildTitleLabelRow(label) {
  let trow = $('<tr>',{});
  trow.append(buildTitleLabelCol(label));
  return trow;
}

function buildStarRow() {
  let trow = $('<tr>',{});
  trow.append(buildStarCol());
  return trow;
}


function buildTitleLabelCol(label) {
  let col;
  col = $('<td>', {});
  col.css({'width':'100%'});
  col.append(label);
  return col;
}

function buildStarCol(){
  let span = $('<span>',{text:'prueba'});
  let col;
  col = $('<td>', {});
  col.css('width', '100%');
  col.append(span);
  return col;
}


//--------------------------Button Events ------------------//

function loadCancelEvent(btn, formObj){
  btn.on('click',(e) => {
    e.stopPropagation();
    formObj.removeForm();
    formObj.cancelCallback();
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
