/*jshint esversion: 6 */

const Shortcuts = require('./../shortcuts/shortcuts');
const MsgBox = require('./../messageBox/messageBox');

let messenger = new MsgBox();
let listController;
let swipeController;

// Todo as it was when the file was printed into the list.
let todo;
let listItem;

// + and - buttons
let addBtn;
let subsBtn;

// Row where progress btns are printed.
let progressRow;

// Total hours and progress
let totalHours;
let currentProgress;

// Used to remember the hours and progress before any
// changed were applied using the modal.
let hours;
let progress;


/**
 *
 */
module.exports = class ProgressForm{
  constructor(listControl, swipeControl){
    listController = listControl;
    swipeController = swipeControl;
  }



  /**
   * displayForm - Remembers the initial hour and progress values
   * prints the add progress modal and deactivates the shortcuts
   * from the main screen.
   *
   * @param  {Object} currentTodo todo item from the db.
   */
  displayForm(currentTodo){

    // Disable main page shortcuts.
    Shortcuts.removeMainPageShortctus();

    // Save todo and current list item.
    todo = currentTodo;
    listItem = $(`#${todo._id}`);

    // Get most recent hours and progress info
    // directly from the listItem.
    hours = listItem.attr('data-hours');
    progress = listItem.attr('data-progress');


    // We copy the hour and progress data into differente variables
    // so we can manipulate this data without losing the original
    // info that we will use when saving the changes into the db.
    totalHours = (hours == 'Fast task') ? 1: Number(hours);
    currentProgress = Number(progress);


    // Display modal
    $(document.body).append(buildModal());

    // Refresh Progress bar
    refreshProgress();

  }

};



/**
 * saveProgress - Makes sure that there is an internet conection,
 * checks that the initial values have changed and then reflect
 * the changes into the list item and into the database saving
 * the corresponding earned or losed points.
 * It also changes the task status of completed.
 */
function saveProgress() {

  // Abort saving if there is no Internet conection.
  if(navigator.onLine){

    // Abort doing anything if the initial values
    // remain the same.
    if(totalHours!=hours || currentProgress!=progress){

      // If hours and progress are the same,
      // then we can mark the task as completed
      // and save all the earned points as one single item.
      if(totalHours == currentProgress){

        let completedTodo = {id: todo._id,
                            hours: (hours=='Fast task') ? 1: hours,
                            progress: progress};

        // Mark object as complete and extract points
        listController.completeTodo(completedTodo);

        // Removes object and minimizes list header if went empty.
        swipeController.minimize(todo._id);

      }else{

        // Udate list item counter, progress bar and inner data.
        // Counter is not visible for fast tasks, that's why we
        // make it visible in here by default.
        listItem.find('#progress_div').text(`${currentProgress}/${totalHours}`);
        listItem.find('#progress_div').css('opacity','1');
        listItem.find('#progress_div').css('color','rgb(21, 81, 181)');

        listItem.attr('data-hours',totalHours);
        listItem.attr('data-progress',currentProgress);

        barLength = (currentProgress>0) ? Math.round((currentProgress/Number(totalHours))*100) : 0;
        listItem.find('.task_item_progress_bar').css('width',barLength+'%');

        // Find if points must be added or rested from the db.
        let points = currentProgress - progress;

        // If points must be added, add them one by one, assigning them
        // an id equal to the todo.id + _p + point index
        if(points>=1){

          for(let pt=Number(progress) + 1; pt<currentProgress+1; pt++){
            listController.sendPoint(`${todo._id}_p${pt}`, todo);
          }

        // If points have to be removed, request the db to remove
        // those points from the database.
        }else if(points<0){

          for(let pto=currentProgress+1; pto<Number(progress) + 1; pto++){
            listController.removePoint(`${todo._id}_p${pto}`);
          }

        }

        listController.updateTaskProgress(todo._id,
                                          {hours: totalHours,
                                           progress: currentProgress
                                           });

      }
    }

  closeModal();

  }else{
    messenger.showMsgBox('Failed to save new data. \nCheck if there is an internet connection.','error','down');
  }
}


/**
 * @private
 * insertProgress - Updates progress bar based on user input.
 * @param  {Number} option Indicates selected cell.
 */
function insertProgress(option){

  if(currentProgress==option){
    currentProgress=option-1;
  }else{
    currentProgress=option;
  }

  refreshProgress();
}



/**
 * @private
 * refreshProgress - Prints the progress bar based based on the current
 * totalhours and currentprogress values.
 */
function refreshProgress() {

  progressRow.empty();

  let table = $('<table>', {
    id: 'progress_table',
    cellspacing:0,
    cellpadding:0});
  table.css('width','100%');

  let body = $('<tbody>');
  body.css('width','100%');

  let firstRow = $('<tr>');
  let secondRow = $('<tr>');

  body.append(firstRow).append(secondRow);
  table.append(body);
  progressRow.append(table);

  for(let i=1; i<totalHours+1; i++){

    let progressBtn = $('<td>',{
      class: 'progress_modal_progress_cell',
      id: `progress_cell_${i}`});
    firstRow.append(progressBtn);

    let progressLabel = $('<td>',{
      class:'progress_modal_progress_label',
      text: `${i}h`});
    secondRow.append(progressLabel);

    // Add blue color if this hour was completed.
    if(currentProgress>=i){
      progressBtn.css('background-color','#1551b5');
      progressLabel.css('color','#1551b5');
    }

    let cellNumber = i;

    // Add click hanlder to the cell.
    progressBtn.click(() => {insertProgress(cellNumber);});
    progressLabel.click(() => {insertProgress(cellNumber);});


    // Add border radious based on the position of the cell.
    switch (true) {
      case totalHours+1==2:
        progressBtn.css('border-radius','5px');
        break;
      case i==1:
        progressBtn.css('border-radius','5px 0px 0px 5px');
        break;
      case i==totalHours:
        progressBtn.css('border-radius','0px 5px 5px 0px');
        break;
      default:
    }

    // Udpate +- buttons
    refreshControlButtons();

  }

}



/**
 * @private
 * refreshControlButtons - Activates and deactivates total hour
 * control buttons depending on if the totalHours value has reached
 * its top and bottom limits or not.
 */
function refreshControlButtons() {

  switch (true) {
    case totalHours <= 1:
        enableAdd(true);
        enableSubstract(false);
      break;
    case totalHours >= 9:
        enableAdd(false);
        enableSubstract(true);
      break;
    default:
      enableAdd(true);
      enableSubstract(true);
  }
}



/**
 * @private
 * enableAdd - Enables or desables the add hours button.
 * @param  {boolean} active true activates, false desactivates the btn.
 */
function enableAdd(active){

  addBtn.removeClass('btnDisabled');

  if(active){
    addBtn.off('click');
    addBtn.click(() =>{
      totalHours++;
      refreshProgress();
    });
  }else{
    addBtn.off('click');
    addBtn.addClass('btnDisabled');
  }
}



/**
 * @private
 * enableSubstract - Enables or desables the substract hours button.
 * @param  {boolean} active true activates, false desactivates the btn.
 */
function enableSubstract(active){

  subsBtn.removeClass('btnDisabled');

  if(active){
    subsBtn.off('click');
    subsBtn.click(() =>{
      totalHours--;
      if(totalHours<currentProgress){currentProgress=totalHours;}
      refreshProgress();
    });
  }else{
    subsBtn.off('click');
    subsBtn.addClass('btnDisabled');
  }
}



/**
 * @private
 * buildModal - Returns a popup screen with a title, subtitle, and btns.
 * @return {$}  jquery element.
 */
function buildModal() {

  // Modal window
  let modal = $('<div>', {
    class:'modal_centered modal_score',
    id:'modal_score',
  });

  // Modal background

  let modalBackground = $('<div>', {
    class: 'modal_blackBackground',
    id:'modal_score_background'});

  modalBackground.append(modal);


  // Modal title row

  let titleRow = $('<div>',{
    class: 'modal_title_row'
  });

  let titleSpan = $('<span>',{
    class: 'modal_title_text',
    text: 'Add your progress!'
  });

  let closeBtn = $('<span>',{
    class: 'modal_close_btn_container'
  });

  let closeIcon = $('<img>',{
    src:'/assets/btn_close_modal.svg',
    class: 'modal_close_icon'
  });

  closeBtn.click(()=>{
    closeModal();
  });

  closeBtn.append(closeIcon);
  titleRow.append(closeBtn);

  titleRow.append(titleSpan);


  // Modal task name row

  let todoNameRow = $('<div>',{
    class: 'modal_subtitle_row'
  });

  let todoNameSpan = $('<span>',{
    class: 'modal_subtitle_text',
    text: todo.name
  });

  todoNameRow.append(todoNameSpan);


  // Progress Row

  progressRow = $('<div>',{
    class: 'modal_content_row'
  });


  // Buttons row

  let btnRow = $('<div>',{
    id: 'modal_btns_row',
  });

  addBtn = $('<span>',{
    class: 'blue_botton_little',
    id: 'progress_modal_addBtn',
    text: '+'});
  addBtn.css('float','left');

  subsBtn = $('<span>',{
    class: 'blue_botton_little',
    id: 'progress_modal_restBtn',
    text: '-'});
  subsBtn.css('float','left');
  subsBtn.css('margin-right','4px');

  let saveBtn = $('<span>',{
    class: 'blue_botton',
    text: 'Save'});
  saveBtn.css('float','right');

  saveBtn.click(()=>{
    saveProgress();
  });


  btnRow.append(saveBtn)
        .append(subsBtn)
        .append(addBtn);


  modal.append(titleRow)
       .append(todoNameRow)
       .append(progressRow)
       .append(btnRow);

  return modalBackground;
}



/**
 * @private
 * closeModal - Closes modal and restores main screen shortcuts.
 */
function closeModal(){

  // Set main page Shortcuts
  // (Remove first to avoid any possible duplicates. )
  Shortcuts.removeMainPageShortctus();
  Shortcuts.setMainPageShortcuts();

  $('#modal_score_background').fadeOut(200);

  setTimeout( () => {
    $('#modal_score_background').remove();
  }, 200);
}
