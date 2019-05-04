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

module.exports = class Form extends EventEmitter{
  constructor(){
  super();
    this.messanger = new MsgBox();
  }

  /**
   * Returns the form header dom including a title icon,
   * a title text and a X-shape close btn.
   * titleText (text);
   * titleIcon (Icon object);
   */
  buildHeader(titleText, titleIcon){
    return buildHeaderDom(titleText, titleIcon, this);
  }

  /**
   * Returns the form body dom including all the
   * rows passed each one inside its corresponding
   * form table.
   * rows (array of jqueries);
   */
  buildBody(rows){
    return buildBodyDom(rows);
  }

  /**
   * Returns the form contained in a background
   * div that applies a dark effect surrounding
   * the form.
   * header (jquery element);
   * body (jquery element);
   */
  buildForm(header, body){
    return buildFormDom(header, body, this);
  }


  /**
   * Removes the form from the app document body and
   * restores the app global shortcuts.
   */
  removeForm(){
    closeForm(this.form);
  }


  /**
   * Sets form general shortcuts like ESCAPE for closing the
   * form and ENTER for saving the input.
   */
  setFormShortcuts(){
    setFormShortcuts(this);
  }

  /**
   * Remove global shortcuts if exists.
   */
  removeGlobalShortcuts(){
    shortcuts.removeAllGlobalShortcuts();
  }


  /**
   * Displays the passed text as an error message on the
   * top of the screen.
   */
  displayErrorMsg(msg){
    this.messanger.showMsgBox(msg,'error','up');
  }

  /**
   * Calls the extended object method in charge of retrieving the
   * input from the form and sending it back to the form caller.
   */
  save(){
  }

};


//--------------------------Build header ------------------//

function buildHeaderDom(titleText, titleIcon, formObj){

  let container = $('<div>', {class:'form_headerContainer'});
  let table = $('<table>',{class:'form_headerTable'});
  let tbody = $('<tbody>');

  tbody.append(buildTitleIcon(titleIcon));
  tbody.append(buildTitleText(titleText));
  tbody.append(buildCloseBtn(formObj));

  table.append(tbody);
  container.append(table);
  return container;
}

function buildTitleIcon(titleIcon){
  let iconTd = $('<td>',{class:'form_iconCol'});
  let icon = titleIcon;
  icon.addClass('form_icon');
  iconTd.append(icon);
  return iconTd;
}

function buildTitleText(titleText){
  let titleTd = $('<td>',{class:'form_titleCol'});
  let title = $('<span>',{
    class: 'form_titleText',
    text: titleText});
  titleTd.append(title);
  return titleTd;
}

function buildCloseBtn(formObj){
  let closeBtnTd = $('<td>',{});
  let closeBtnContainer = $('<div>');
  let closeBtnSpan = $('<span>');
  let closeBtnIcon = Icons.close();
  closeBtnIcon.addClass('form_closeBtnIcon');
  closeBtnIcon.on('click', () => formObj.removeForm());

  closeBtnSpan.append(closeBtnIcon);
  closeBtnContainer.append(closeBtnSpan);
  closeBtnTd.append(closeBtnContainer);
  return closeBtnTd;
}


//--------------------------Build body ------------------//

function buildBodyDom(rows) {
  let iframe = $('<div>', {class:'form_bodyIframe'});

  $.each(rows, (index, row) =>{
      iframe.append(buildBodyRow(row));
  });

  let container;
  container = $('<div>', {class:'form_bodyContainer'});
  container.append(iframe);
  return container;
}

function buildBodyRow(row){
  let tbody;
  tbody = $('<tbody>',{});
  tbody.append(row);

  let table;
  table = $('<table>',{});
  table.css('width','100%');
  table.append(tbody);
  return table;
}


//--------------------------Build form ------------------//

function buildFormDom(header, body, formObj){
  // Form container
  let modal;
  modal = $('<div>', {class:'form_container'});
  modal.append(header);
  modal.append(body);

  // Form background
  let form;
  form = $('<div>', {class: 'modal_blackBackground', id:'form_background'});
  form.append(modal);

  let formWhEvent = setOutsideClickEvent(form, formObj);
  return formWhEvent;
}

function setOutsideClickEvent(form, formObj) {
  form.on('click', (e) =>{
    let notModal = document.getElementById('form_background');
    if(e.target == notModal){formObj.removeForm();}
  });
  return form;
}



//--------------------------Set shortcuts ------------------------//

function setFormShortcuts(formObj){
  //Reset first to make sure that we are not adding
  // the same event multiple times.
  $(document).off('keydown');
  $(document).keydown((e) => {
    e.stopPropagation();
    if (e.keyCode == 27) {formObj.removeForm();}
    if (e.keyCode == 13){
      e.preventDefault();
      formObj.save();
    }
  });
}


//--------------------------Close form ------------------------//


function closeForm(form){
  form.remove();
  // Removes any main page shortcuts that could affect
  // this form (if there are) and sets new ones.
  shortcuts.removeAllGlobalShortcuts();
  shortcuts.setAllGlobalShortcuts();
}
