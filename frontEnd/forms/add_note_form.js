/*jshint esversion: 6 */

const Shortcuts = require('./../shortcuts/shortcuts');
const MsgBox = require('./../messageBox/messageBox');
const SetCurlet = require('./../otherMethods/setCaret');

let messenger = new MsgBox();

let listController;

// Todo as it was when the file was printed into the list.
let todo;

// Note data extracted from the user interface list item.
let notes;

// Note input dom.
let inputTextBox;

// Reference to the user interface list item.
let listItem;


module.exports = class NotesForm{
  constructor(listControl, swipeControl){
    listController = listControl;
  }


  displayForm(currentTodo){

    // Disable main page shortcuts.
    Shortcuts.removeMainPageShortcuts();

    // Save todo and current list item.
    todo = currentTodo;
    listItem = $(`#${todo._id}`);

    // Get most recent note data
    // directly from the listItem.
    notes = listItem.attr('data-notes');

    // Display modal
    $(document.body).append(buildModal());

    inputTextBox.text(notes);
    inputTextBox.focus();

    // Adds escpe shortcut.
    $(document).off('keydown');
    $(document).keydown((e) => {
      if (e.keyCode == 27) {
        closeModal();
      }
    });

    // Places curlet at the end of the text.
    let textBoxNode = document.getElementsByClassName('notes_textBox')[0];
    SetCurlet.setEndOfContenteditable(textBoxNode);

  }

};


function saveChanges(){

  // Abort saving if there is no Internet conection.
  if(navigator.onLine){

    let updateRequest = {notes:inputTextBox.text()};

   // Mark object as complete and extract points
   listController.updateTaskProgress(todo._id, updateRequest);

   // Updates value in user interface list item too.
   listItem.attr('data-notes',inputTextBox.text());

   closeModal();

   if(inputTextBox.text()!=''){
     listItem.find('#notesTag').css('opacity','0.75');
   }else{
     listItem.find('#notesTag').css('opacity','0');
   }

  }else{
    messenger.showMsgBox('Failed to save new data. \nCheck if there is an internet connection.','error','down');
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
    class:'modal_centered modal_notes',
    id:'modal_notes',
  });


  // Modal background

  let modalBackground = $('<div>', {
    class: 'modal_blackBackground',
    id:'modal_notes_background'});

  modalBackground.append(modal);


  // Modal title row

  let titleRow = $('<div>',{
    class: 'modal_title_row'
  });

  let titleSpan = $('<span>',{
    class: 'modal_title_text',
    text: 'Side Notes'
  });

  let closeBtn = $('<span>',{
    class: 'modal_close_btn_container',
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

  // Textbox Row

  let inputRow = $('<div>',{
    class: 'modal_content_row'
  });
  inputRow.css('margin-bottom', '16px');

  inputTextBox = $('<div>',{
    class:'notes_textBox',
    autocomplete: 'off',
    contenteditable: 'true',
    placeholder: 'Something important about this task?',
    tabindex: '1'
  });

  inputTextBox.keydown((e) =>{
    if (e.which === 13 && e.shiftKey === false){
      e.preventDefault();
      saveChanges();
    }
  });


  // Buttons row

  let btnRow = $('<div>',{
    id: 'modal_btns_row',
  });
  btnRow.css('text-align','center');

  let saveBtn = $('<span>',{
    class: 'blue_botton',
    tabindex: '2',
    text: 'Save'});
  saveBtn.css('margin-right', '5px');

  let cancelBtn = $('<span>',{
    class: 'blue_botton',
    tabindex: '3',
    text: 'Cancel'});
  cancelBtn.css('margin-left', '5px');

  saveBtn.click(()=>{
    saveChanges();
  });

  saveBtn.keydown((e) =>{
    if (e.which === 13){
      saveChanges();
    }
  });

  cancelBtn.click(()=>{
    closeModal();
  });

  cancelBtn.keydown((e) =>{
    if (e.which === 13){
      closeModal();
    }
  });

  btnRow.append(saveBtn)
        .append(cancelBtn);

  inputRow.append(inputTextBox);

  modal.append(titleRow)
       .append(todoNameRow)
       .append(inputRow)
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
  Shortcuts.removeMainPageShortcuts();
  Shortcuts.setMainPageShortcuts();

  $('#modal_notes_background').fadeOut(200);

  setTimeout( () => {
    $('#modal_notes_background').remove();
  }, 200);
}
