/*jshint esversion: 6 */
const Form = require('./../forms/form');
const icons = require('./../icons/icons.js');
const SetCurlet = require('./../otherMethods/setCaret');



module.exports = class NoteEditorForm extends Form{
  constructor(saveCallback, task){
  super();

  this.saveCallback = saveCallback;
  this.task = task;

  }


  /**
   * Builds form with all its elements and events and appends
   * the form to the document;
   */
  displayForm(){

    // Changes applied to the app document.
    this.removeGlobalShortcuts();

    // Form title text and icon
    let titleText = 'Side notes';
    let titleIcon = icons.notes('#1551b5');
    this.header = this.buildHeader(titleText, titleIcon);

    // Form controllers
    this.taskTitleLabel = buildTaskTitleLabel(this.task.title);
    this.noteField = buildNoteField();
    this.saveButton = buildSaveButton(this);
    this.cancelButton = buildCancelButton(this);

    // Put form together
    this.bodyRows = [];
    this.bodyRows.push(buildTitleLabelRow(this.taskTitleLabel));
    this.bodyRows.push(buildNoteRow(this.noteField));
    this.bodyRows.push(buildButonRow(this.saveButton,
                                     this.cancelButton));

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
    this.inputTaskData();

    // Fcous note field and place the curlet at the end.
    this.noteField.focus();
    SetCurlet.setEndOfContenteditable(this.noteField[0]);

  }



  /**
   * Inputs loaded task note data into form note field.
   */
  inputTaskData(){
    if (this.task.notes!=null || this.task.notes!=undefined){
      this.noteField.text(this.task.notes);
    }
  }


  /**
   * Updates task with new note data, closes form and
   * calls callback (saves new task into option list
   * and refreshes page).
   */
  save(){
    let isValidInput = this.checkFormInput();
    if (isValidInput){
      this.task.notes = this.noteField.text();
      this.removeForm();
      this.saveCallback(this.task);
    }
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
  label.text('Task:  ' + title);
  label.css({'text-align':'left',
             'font-weight':'bold',
             'padding-left':'12px',
             'font-size':'14px',
             'white-space':'pre-wrap',
             'overflow':'hidden',
             'text-overflow':'ellipsis'});
  return label;
}

function buildNoteField() {
  let field;
  field = $('<div>', {class: 'form_textInputField'});
  field.attr('placeholder','Things to keep in mind for this task...');
  field.attr('contenteditable','true');
  field.attr('autocomplete','off');
  field.attr('tabindex','3');
  field.css('min-height','120px');
  return field;
}

function buildSaveButton(formObj) {
  let btn;
  btn = $('<span>', {text:'Save', class:'blue_botton'});
  btn.attr('tabindex','4');
  btn.css('margin-right','8px');
  btn.css('width','52px'); //So it displays the same size as cancelbtn
  let btnWithEvent = loadSaveEvent(btn, formObj);
  return btnWithEvent;
}

function buildCancelButton(formObj) {
  let btn;
  btn = $('<span>', {text:'Cancel', class:'blue_botton'});
  btn.attr('tabindex','5');
  let btnWithEvent = loadCancelEvent(btn, formObj);
  return btnWithEvent;
}




//--------------------------Build body rows ------------------//

function buildTitleLabelRow(label) {
  let trow = $('<tr>',{});
  trow.append(buildTitleLabelCol(label));
  return trow;
}

function buildNoteRow(description) {
  let trow = $('<tr>',{});
  trow.append(buildNoteCol(description));
  return trow;
}

function buildButonRow(saveBtn, cancelBtn) {
  let trow = $('<tr>',{});
  trow.append(buildLowerButtonCol(saveBtn, cancelBtn));
  return trow;
}

function buildTitleLabelCol(label) {
  let col;
  col = $('<td>', {});
  col.css({'width':'100%'});
  col.append(label);
  return col;
}

function buildNoteCol(field){
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
  col.css('padding', '4px 0px 0px');
  col.css('text-align', 'center');
  col.append(saveBtn)
     .append(cancelBtn);
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
