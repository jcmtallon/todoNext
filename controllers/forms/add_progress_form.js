/*jshint esversion: 6 */

const Shortcuts = require('./../shortcuts/shortcuts');
const MainPageShortcuts = new Shortcuts();

let listController;
let todo;



module.exports = class ProgressForm{
  constructor(listControl){
    listController = listControl;
  }


  displayForm(currentTodo){

    // Disable main page shortcuts.
    MainPageShortcuts.removeMainPageShortctus();

    todo = currentTodo;
    $(document.body).append(buildModal());

  }

};


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
    text: 'Add your progress for this task!'
  });

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


  // Buttons row

  let btnRow = $('<div>',{
    id: 'modal_progress_btns_row',
  });

  let addBtn = $('<span>',{
    class: 'blue_botton',
    id: 'progress_modal_addBtn',
    text: '+'});
  addBtn.css('float','right');

  let subsBtn = $('<span>',{
    class: 'blue_botton',
    id: 'progress_modal_restBtn',
    text: '-'});
  subsBtn.css('float','right');
  subsBtn.css('margin-right','4px');

  let saveBtn = $('<span>',{
    class: 'blue_botton',
    id: 'progress_modal_saveBtn',
    text: 'Save'});
  saveBtn.css('float','left');
  saveBtn.css('margin-right','4px');

  let cancelBtn = $('<span>',{
    class: 'blue_botton',
    id: 'progress_modal_cancelBtn',
    text: 'Cancel'});
  cancelBtn.css('float','left');

  btnRow.append(saveBtn).append(cancelBtn);
  btnRow.append(addBtn).append(subsBtn);


  // let options = [
  //   {id:'star1', value:0.50, index:1},
  //   {id:'star2', value:0.75, index:2},
  //   {id:'star3', value:1, index:3},
  //   {id:'star4', value:1.25, index:4},
  //   {id:'star5', value:1.5, index:5}
  // ];
  //
  // $.each(options,(index, option)=>{
  //
  //   let starIcon = $('<img>',{
  //     src: '/assets/icon_star.svg',
  //     id: option.id,
  //     value: option.value,
  //     class: 'score_stars',
  //     'data-index': option.index
  //   });
  //
  // // Add hover functionality.
  // starIcon.hover(e => showStars(e.target.id), e => hideStars());
  //
  // // Add on click functionality.
  // starIcon.click(e => saveScore(e.target));
  //
  // starRow.append(starIcon);
  //
  // });

  modal.append(titleRow).append(todoNameRow).append(btnRow);
  return modalBackground;
}

function closeModal(){

  // Set main page Shortcuts
  // (Remove first to avoid any possible duplicates. )
  MainPageShortcuts.removeMainPageShortctus();
  MainPageShortcuts.setMainPageShortcuts();

  $('#modal_score_background').fadeOut(100);

  setTimeout( () => {
    $('#modal_score_background').remove();
  }, 200);
}
