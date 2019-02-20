/*jshint esversion: 6 */

const Shortcuts = require('./../shortcuts/shortcuts');
const Icons = require('./../icons/icons.js');

let listController;
let todo;
let todoName;



module.exports = class ScoreForm{
  constructor(listControl){
    listController = listControl;
  }



  /**
   * displayForm - Saves todo and prints score modal into the screen.
   *
   * @param  {Object} completedTodo ex {id:xxx, hours:xxx, progress:xxxx}
   */
  displayForm(completedTodo, name){

    // Disable main page shortcuts.
    Shortcuts.removeMainPageShortctus();

    todo = completedTodo;
    todoName = name;
    $(document.body).append(buildModal());

  }
};



/**
 * @private
 * buildModal - Prints modal into the screen and apply events to modal.
 */
function buildModal(){

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
    text: 'Rate this task!'
  });

  let closeBtn = $('<span>',{
    class: 'modal_close_btn_container'
  });

  let closeIcon = Icons.close();
  closeIcon.addClass('modal_close_icon');

  closeBtn.click(()=>{
    cancelScore();
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
    text: todoName
  });

  todoNameRow.append(todoNameSpan);


  // Modal star row

  let starRow = $('<div>',{
    id: 'modal_star_row'
  });

  let options = [
    {id:'star1', value:0.50, index:1},
    {id:'star2', value:0.75, index:2},
    {id:'star3', value:1, index:3},
    {id:'star4', value:1.25, index:4},
    {id:'star5', value:1.5, index:5}
  ];

  $.each(options,(index, option)=>{

    let starIcon = Icons.star();
    starIcon.attr({'id':option.id,
                   'value':option.value,
                   'class': 'score_stars',
                   'data-index': option.index});

  // Add hover functionality.
  starIcon.hover(e => showStars(e.target.id), e => hideStars());

  // Add on click functionality.
  starIcon.click(e => saveScore(e.target));

  starRow.append(starIcon);

  });

  modal.append(titleRow).append(todoNameRow).append(starRow);
  return modalBackground;

}



/**
 * saveScore - Retrieves value from selected star and request list controller
 * to save the value, mark the task as done and save the scored points.
 * @private
 * @param  {Object} star dom element
 */
function saveScore(star) {

  todo.progress = Number(star.getAttribute('value'));

  closeModal();
  listController.completeTodo(todo);

}





/**
 * closeModal - Removes modal from screen.
 * Small timeout effect added so the fadeout
 * animation does not get interrupted.
 * @Private
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




/**
 * cancelScore - Closes the modal without saving any data
 * and reprints the active todo list.

 */
function cancelScore(){

  listController.printActiveTodos([]);
  closeModal();
}



/**
 * showStars - Hightlights stars based on the id passed.
 * @private
 * @param  {string} id description
 */
function showStars(id) {

  switch (id) {
    case 'star1':
      $("#star1").children(0).attr('fill', '#1551b5');
      break;
    case 'star2':
      $("#star1").children(0).attr('fill', '#1551b5');
      $("#star2").children(0).attr('fill', '#1551b5');
      break;
    case 'star3':
      $("#star1").children(0).attr('fill', '#1551b5');
      $("#star2").children(0).attr('fill', '#1551b5');
      $("#star3").children(0).attr('fill', '#1551b5');
      break;
    case 'star4':
      $("#star1").children(0).attr('fill', '#1551b5');
      $("#star2").children(0).attr('fill', '#1551b5');
      $("#star3").children(0).attr('fill', '#1551b5');
      $("#star4").children(0).attr('fill', '#1551b5');
      break;
    case 'star5':
      $("#star1").children(0).attr('fill', '#1551b5');
      $("#star2").children(0).attr('fill', '#1551b5');
      $("#star3").children(0).attr('fill', '#1551b5');
      $("#star4").children(0).attr('fill', '#1551b5');
      $("#star5").children(0).attr('fill', '#1551b5');
      break;
  }
}


/**
 * @private
 * hideStars - Removes highlight from all score starts
 */
function hideStars() {

  let starts = $('.score_stars');
  starts.children().attr('fill', '#c6c6c6');
}
