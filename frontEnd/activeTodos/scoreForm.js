/*jshint esversion: 6 */
const Form = require('./../forms/form');
const icons = require('./../icons/icons.js');

let activeColor = '#1551b5';
let deactiveColor = '#c6c6c6';
let score = [0.5,
              0.75,
              1,
              1.25,
              1.5];

module.exports = class ScoreForm extends Form{
  constructor(saveCallback, cancelCallback, task){
  super();

  this.saveCallback = saveCallback;
  this.cancelCallback = cancelCallback;
  this.task = task;

  // Tells the Form parent to center the form vertically.
  this.isCentered = true;
  this.formWidth = 390;

  this.saveTask = (score) => {this.save(score);};

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
    let titleIcon = icons.star(activeColor);
    this.header = this.buildHeader(titleText, titleIcon);

    // Form controllers
    this.taskTitleLabel = buildTaskTitleLabel(this.task.title);
    this.starOne = buildStarBtn(this.saveTask, score[0]);
    this.starTwo = buildStarBtn(this.saveTask, score[1], [this.starOne]);
    this.starThree = buildStarBtn(this.saveTask, score[2], [this.starOne, this.starTwo]);
    this.starFour = buildStarBtn(this.saveTask, score[3], [this.starOne, this.starTwo, this.starThree]);
    this.starFive = buildStarBtn(this.saveTask, score[4], [this.starOne, this.starTwo, this.starThree, this.starFour]);

    // Put form together
    this.bodyRows = [];
    this.bodyRows.push(buildTitleLabelRow(this.taskTitleLabel));
    this.bodyRows.push(buildStarRow([this.starOne,
                                     this.starTwo,
                                     this.starThree,
                                     this.starFour,
                                     this.starFive]));

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
   * Updates task with new note data, closes form and
   * calls callback (saves new task into option list
   * and refreshes page).
   */
  save(score){
    let isValidInput = this.checkFormInput();
    if (isValidInput){
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

//-----------------------Build star btns bar -------------------//

function buildStarBtn(save, score, prevStars) {

  let icon;
  icon = icons.star(deactiveColor);
  icon.attr({'class': 'score_stars'});

  icon.hover(e => highlightStar(icon, prevStars), e => unhighlightStars(icon, prevStars));
  icon.click(e => save(score));
  return icon;
}



function highlightStar(hoverStar, prevStars) {
  hoverStar.children(0).attr('fill', activeColor);
  if (prevStars!=undefined){
    $.each(prevStars,(index, star)=>{
      star.children(0).attr('fill', activeColor);
    });
  }
}

function unhighlightStars(hoverStar, prevStars) {
  hoverStar.children(0).attr('fill', deactiveColor);
  if (prevStars!=undefined){
    $.each(prevStars,(index, star)=>{
      star.children(0).attr('fill', deactiveColor);
    });
  }
}



//--------------------------Build fields ----------------------//

function buildTaskTitleLabel(title) {
  let label;
  label = $('<div>', {});
  label.text(title);
  label.css({'text-align':'left',
             'font-weight':'bold',
             'font-size':'14px',
             'white-space':'pre-wrap',
             'overflow':'hidden',
             'text-overflow':'ellipsis',
             'margin-top': '-6px'});
  return label;
}



//--------------------------Build body rows ------------------//

function buildTitleLabelRow(label) {
  let trow = $('<tr>',{});
  trow.append(buildTitleLabelCol(label));
  return trow;
}

function buildStarRow(stars) {
  let trow = $('<tr>',{});
  trow.css({'text-align':'center'});
  trow.append(buildStarCol(stars));
  return trow;
}


function buildTitleLabelCol(label) {
  let col;
  col = $('<td>', {});
  col.css({'width':'100%'});
  col.append(label);
  return col;
}


function buildStarCol(stars){

  let container;
  container = $('<div>',{});
  container.css({'padding':'25px 0px'});
  $.each(stars,(index, star)=>{
    container.append(star);
  });

  let col;
  col = $('<td>', {});
  col.css('width', '100%');
  col.append(container);
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
