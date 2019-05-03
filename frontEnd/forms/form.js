/*jshint esversion: 6 */
const shortcuts = require('./../shortcuts/shortcuts');
const Icons = require('./../icons/icons.js');
const EventEmitter = require('events');
const MsgBox = require('./../messageBox/messageBox');

/**
 * Provides build, setTitle,setRows and other methods
 * that instantiated classes can use to fabricate
 * user forms.
 */

// Icon displayed next to the title.
let _titleIcon;

// Form dom element.
let _form;

// Id of the container dom appended to the background dom element that
// this class returns.
let _formContainerId = 'form_container';

// Id of the body frame where all the rows and controllers will be
// appended later.
let _bodyFrameId = 'form_bodyIframe';



module.exports = class Form extends EventEmitter{
  constructor(){
  super();
    this.messanger = new MsgBox();
  }


  /**
   * Called before displayForm to set the title that
   * will be displayed in the top of the form.
   */
  setTitle(title){
    this.title = title;
  }


  /**
   *
   */
  setTitleIcon(icon){
    _titleIcon = icon;
  }


  /**
   * Builds the form with all its elements and
   * displays the form on top of the current page.
   */
  setBaseTemplate(){
    shortcuts.removeAllGlobalShortcuts();
    $(document.body).append(buildModal(this.title));
    setCloseEvents();
    setFormShortcuts(this);
  }


  /**
   *
   */
  removeForm(){
    closeForm();
  }


  /**
   * Appends the indicated number of rows to the
   * body container of the form.
   */
  addBodyRows(nbOfTables, rowId){
    for (let i=1; i<nbOfTables+1;i++){
      $('#' + _bodyFrameId).append(buildBodyRow(i, rowId));
    }
  }


  get formContainerId(){
    return _formContainerId;
  }

  /**
   *
   */
  setFormShortcuts(){
    setFormShortcuts(this);
  }


  /**
   *
   */
  displayErrorMsg(msg){
    this.messanger.showMsgBox(msg,'error','up');
  }

  save(){
  }

};


//--------------------------Build functions ------------------//

function buildModal(titleText){

  // Form container
  let modal = $('<div>', {
    class:'form_container',
    id:_formContainerId
  });

  // Form background
  _form = $('<div>', {
    class: 'modal_blackBackground',
    id:'form_background'});

  modal.append(buildHeader(titleText));
  modal.append(buildBody());

  _form.append(modal);
  return _form;
}




function buildHeader(titleText){

  let container = $('<div>', {class:'form_headerContainer'});
  let table = $('<table>',{class:'form_headerTable'});
  let tbody = $('<tbody>');

  // Form icon
  let iconTd = $('<td>',{class:'form_iconCol'});
  let icon = _titleIcon;
  icon.addClass('form_icon');
  iconTd.append(icon);

  // Form title
  let titleTd = $('<td>',{class:'form_titleCol'});
  let title = $('<span>',{
    class: 'form_titleText',
    text: titleText});
  titleTd.append(title);

  // Form close btn
  let closeBtnTd = $('<td>',{});
  let closeBtnContainer = $('<div>');
  let closeBtnSpan = $('<span>');
  let closeBtnIcon = Icons.close();
  closeBtnIcon.addClass('form_closeBtnIcon');

  closeBtnSpan.append(closeBtnIcon);
  closeBtnContainer.append(closeBtnSpan);
  closeBtnTd.append(closeBtnContainer);
  tbody.append(iconTd).append(titleTd).append(closeBtnTd);
  table.append(tbody);
  container.append(table);

  return container;
}



function buildBody(){
  let container = $('<div>', {class:'form_bodyContainer'});
  let iframe = $('<div>', {class:'form_bodyIframe',id: _bodyFrameId});
  container.append(iframe);
  return container;
}



function buildBodyRow(rowNb, rowId){
  let table = $('<table>',{});
  table.css('width','100%');

  let tbody = $('<tbody>',{});
  let trow = $('<tr>',{id: rowId + rowNb});

  tbody.append(trow);
  table.append(tbody);
  return table;
}


//--------------------------Set events ------------------------//

function setCloseEvents(){
  // close modal when clicking button
  let closeBtn = $('.form_closeBtnIcon');
  closeBtn.on('click', () => closeForm());

  // close modal when clicking outside
  _form.on('click', (e) =>{
    let notModal = document.getElementById('form_background');
    if(e.target == notModal){closeForm();}
  });
}




function closeForm(){
  _form.remove();
  // Removes any main page shortcuts that could affect
  // this form (if there are) and sets new ones.
  shortcuts.removeAllGlobalShortcuts();
  shortcuts.setAllGlobalShortcuts();
}




function setFormShortcuts(formObj){
  //Reset first to make sure that we are not adding
  // the same event multiple times.
  $(document).off('keydown');
  $(document).keydown((e) => {
    e.stopPropagation();
    if (e.keyCode == 27) {closeForm();}
    if (e.keyCode == 13){
      e.preventDefault();
      formObj.save();
    }
  });
}
