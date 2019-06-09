/*jshint esversion: 6 */
const Form = require('./../forms/form');
const icons = require('./../icons/icons.js');



module.exports = class ProgressForm extends Form{
  constructor(saveCallback, todo){
  super();

  this.saveCallback = saveCallback;
  this.todo = todo;

  // Tells the Form parent to center the form vertically.
  this.isCentered = true;
  this.formWidth = 390;


  // Action when clicking the progress bar buttons.
  this.progressBtnAction = (cellNb) =>{
    if(this.todo.progress == cellNb){
      this.todo.progress = cellNb -1;
    }else{
      this.todo.progress = cellNb;
    }
    this.refreshProgress();
  };

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
    this.progressBarRow = buildProgressBarRow();
    this.minusButton = buildMinusButton();
    this.plusButton = buildPlusButton();
    this.saveButton = buildSaveButton(this);

    // Put form together
    this.bodyRows = [];
    this.bodyRows.push(buildTitleLabelRow(this.taskTitleLabel));
    this.bodyRows.push(this.progressBarRow);
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
    this.refreshProgress();
  }


  /**
   * Replaces the current progress bar with a new one
   * that displays the current progress and hour values.
   */
  refreshProgress(){

    //Remove existing table.
    this.progressBarRow.empty();

    //Build bar
    let progressBar = buildProgressBar(this.todo, this.progressBtnAction);
    this.progressBarRow.append(progressBar);

    // Update bar buttons (when necessary)
    this.refreshBarBtns();
  }


  /**
   * Activates and deactivates total hour
   * control buttons depending on if the totalHours value has reached
   * its top and bottom limits or not.
   */
  refreshBarBtns(){
    switch (true) {
      case Number(this.todo.hours) <= 1:
          this.enablePlusButton(true);
          this.enableMinusButton(false);
        break;
      case Number(this.todo.hours) >= 9:
          this.enablePlusButton(false);
          this.enableMinusButton(true);
        break;
      default:
        this.enablePlusButton(true);
        this.enableMinusButton(true);
    }
  }


  /**
   * Enables or disables the plus button
   * depending on the value of the boolean passed.
   */
  enablePlusButton(activate){
    this.plusButton.removeClass('btnDisabled');

    if(activate){
      this.plusButton.off('click');
      this.plusButton.click(() =>{
        this.todo.hours++;
        this.refreshProgress();
      });
    }else{
      this.plusButton.off('click');
      this.plusButton.addClass('btnDisabled');
    }
  }

  /**
   * Enables or disables the minus button
   * depending on the value of the boolean passed.
   */
  enableMinusButton(activate){
    this.minusButton.removeClass('btnDisabled');

    if(activate){
      this.minusButton.off('click');
      this.minusButton.click(() =>{
        this.todo.hours--;
        if(Number(this.todo.hours) < this.todo.progress){
          this.todo.progress = Number(this.todo.hours);
        }
        this.refreshProgress();
      });
    }else{
      this.minusButton.off('click');
      this.minusButton.addClass('btnDisabled');
    }
  }

  /**
   * Updates todo with new note data, closes form and
   * calls callback (saves new todo into option list
   * and refreshes page).
   */
  save(){
    let isValidInput = this.checkFormInput();
    if (isValidInput){
      this.removeForm();
      this.saveCallback(this.todo);
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


function buildProgressBtn(cellNb, progress, total, action) {

  let btn;
  btn = $('<td>',{
    class: 'progress_modal_progress_cell',
    id: `progress_cell_${cellNb}`});

  // Add blue color if this hour was completed.
  if(progress>=cellNb){
    btn.css('background-color','#1551b5');
  }

  // Add click hanlder to the cell.
  btn.click(() => {action(cellNb);});

  // Add border radious based on the position of the cell.
  switch (true) {
    case total+1==2:
      btn.css('border-radius','5px');
      break;
    case cellNb==1:
      btn.css('border-radius','5px 0px 0px 5px');
      break;
    case cellNb==total:
      btn.css('border-radius','0px 5px 5px 0px');
      break;
    default:
  }

  return btn;
}



function buildProgressLabel(cellNumber, progress, action) {

  let label;
  label = $('<td>',{
    class:'progress_modal_progress_label',
    text: `${cellNumber}h`});

  // Add blue color if this hour was completed.
  if(progress>=cellNumber){
    label.css('color','#1551b5');
  }

  // Add click hanlder to the cell.
  label.click(() => {action(cellNumber);});

  return label;

}


//--------------------------Build fields ----------------------//

function buildTaskTitleLabel(title) {
  let label;
  label = $('<div>', {});
  label.text('Task:  ' + title);
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
  let col;
  col = $('<td>', {});
  col.css('width', '100%');
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
