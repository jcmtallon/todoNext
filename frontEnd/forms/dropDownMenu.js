/*jshint esversion: 6 */
const EventEmitter = require('events');

/**
 * Represents a field item that displays a dropdown menu when
 * clicked, focused. Supports three types of dropdown menus:
 * with colors, with icons and only with text options.
 */

 // Options to display in the ddm.
 let _options;

 // This class object, so it can be referred from
 // the private classes too.
 let _ddmClass;

 // Id that the ddm dom will receive, so other
 // methods can locate it and manipulate it
 // in the document.
 let _ddmId = 'activeDdm';

 // Remember the current active row in the ddm.
 let _actRowIdx;

// Remember the assigned tabindex for this field.
// Later sent back to the form so this can send the
// focus to the next field.
let _tabIndex;

/**
 * options ex. {title: xxxx, color: xxxxx, icon: xxxx}
 */
module.exports = class DropDownMenu extends EventEmitter{
  constructor(options){
  super();
    _options = options;
    _ddmClass = this;
  }

  createDdmWithColors(pHholderText, domId, tabIndex){
    let ddMtype = 'withColors';
    let field = createField(pHholderText, domId, tabIndex);
    let fieldWithEvents = addEventsToField(field, ddMtype);
    _tabIndex = tabIndex;
    return fieldWithEvents;
  }

  createDdmWithIcons(){
    _ddbType = 'withIcons';
  }

  createSimpleDdm(){
    _ddbType = 'simple';
  }
};

//------------------------Building ddm --------------------------//

function createField(pHholderText, domId, tabIndex){
  let field = $('<div>', {
    class: 'form_textInputField',
    id: domId});
  field.text(pHholderText);
  field.css('color','grey');
  field.css('cursor', 'pointer');
  field.attr('tabindex', tabIndex);
  field.attr('data-value','');
  return field;
}

function getDropDownMenu(domId, ddmType){
  // Remove current dropdownMenu(if exists).
  removeDropDownMenu();

  let table = $('<table>',{class:'ddm_table'});
  table.append(buildRows(ddmType));

  let frame = $('<div>',{class: 'ddm_frame'});
  frame.append(table);

  let ddm = $('<div>',{class:'ddm_Container', id:_ddmId});
  ddm.append(frame);

  let positionedDdm = setDdmPositionAndSize(ddm, domId);
  positionedDdm.css('display', 'block');

  let finalDdm = setDdmEvents(positionedDdm);

  return finalDdm;
}


function buildRows(type){

  let tbody = $('<tbody>',{});

  switch (type) {
    case 'withColors':
      for (let i = 0; i < _options.length; i++){
        tbody.append(buildRowWithColor(_options[i]));
      }
      break;

    case 'withIcons':
      for (let j = 0; j < _options.length; j++){
        tbody.append(buildRowWithIcon(_options[j]));
      }
      break;

    default:
      for (let k = 0; k < _options.length; k++){
        tbody.append(buildRowWithOnlyText(_options[k]));
      }
  }
  return tbody;
}


function buildRowWithColor(option){

  let row = $('<div>',{});
  row.css('display','flex');
  row.css('align-items','center');

  let leftCol = $('<div>',{class:'ddm_menu_rowLeftCol'});
  let circle = $('<div>',{class:'ddm_colorCircle'});
  circle.css('background-color', option.color);
  leftCol.append(circle);

  let rightCol = $('<div>', {class:'ddm_menu_rowRightCol'});
  rightCol.text(option.title);

  row.append(leftCol)
     .append(rightCol);

  let rowTr = buildRowBase(row);
  return rowTr;
}

function buildRowWithIcon(option){
  // TODO
}

function buildRowWithOnlyText(option){
  // TODO
}


function buildRowBase(rowFrame){
  let tr = $('<tr>',{class: 'greyHightlight'});
  let td = $('<td>',{class: 'ddm_menu_rowColumn'});
  td.append(rowFrame);
  tr.append(td);
  return tr;
}


function setDdmPositionAndSize(ddm, domId){
  let field = $('#'+ domId);
  let ref = field.offset();
  let refWidth = field[0].offsetWidth;
  ddm.css({top: ref.top + 36,
           left: ref.left,
           width: refWidth});
  return ddm;
}



//------------------------Set events --------------------------//


function addEventsToField(field, type){
  field.on('click focus', function (e) {
    // Very important to prevent the following code being
    // executed two times.
    e.stopPropagation();
    // Blur to prevent a on focus loop.
    $(this).blur();
    $(document.body).append(getDropDownMenu(field[0].id, type));
  });
  return field;
}


function setDdmEvents(ddm){

    // Reset activeRowIndex
    _actRowIdx = 0;

    // Selects first row
    let rows = ddm.find('tr');
    rows[_actRowIdx].classList.add('greyHightlight_active');

    // Directional arrows, tab, enter and scape.
    setDdmShortcuts(rows);

    // Mouse over activates row. Click selects option.
    setDdmMouseEvents(rows);

    // Closes ddb when clicking outside.
    setOutsideClickEvent(rows);

    return ddm;
}



function setDdmShortcuts(rows){

  $(document).off('keydown');
  $(document).keydown((e) =>{

    //If key down - select next row
    if (e.keyCode == 40){
      e.preventDefault();
      changeActiveRow('down', rows);

    //If key up - move active up
    }else if(e.keyCode == 38){
      e.preventDefault();
      changeActiveRow('up', rows);

    //If ENTER key --- save selection and remove from textbox
    }else if(e.keyCode ==13){
      e.preventDefault();
      saveMenuSelection(rows);
      removeDropDownMenu();

    //If escape key or TAB - close and reset table menu
    }else if(e.keyCode == 27 || e.keyCode == 9){
      removeDropDownMenu();
    }

  });
}




function setDdmMouseEvents(rows){
  // Hightlights selected row.
  rows.mouseover(function(e){
    rows[_actRowIdx].classList.remove('greyHightlight_active');
    _actRowIdx = $(this).index();
    rows[_actRowIdx].classList.add('greyHightlight_active');
  });

  rows.on('click',() =>{
    saveMenuSelection(rows);
    removeDropDownMenu();
  });

}



function setOutsideClickEvent(rows){

  $(document).off('click');
  $(document).click((e) =>{
      if(e.target != rows){
        $(document).off('click');
        removeDropDownMenu();
      }
  });
}




function changeActiveRow(direction, rows){

  let menu = $('.ddm_frame');
  let newRow;

  // Remove highlight from active row
  let currentRow = rows[_actRowIdx];
  currentRow.classList.remove("greyHightlight_active");

  // Move active row up or down depending on the user input.
  if (direction == 'down'){
      if(_actRowIdx < rows.length-1){
        _actRowIdx++;
        newRow = rows[_actRowIdx];
        if($(newRow).position().top > menu.scrollTop() + menu.height() - $(newRow).height()){
          newRow.scrollIntoView(false);
        }
      }else{
        _actRowIdx = 0;
        newRow = rows[_actRowIdx];
        newRow.scrollIntoView(false);
      }
  }else{
      if(_actRowIdx>0){
        _actRowIdx--;
        newRow = rows[_actRowIdx];
        if($(newRow).position().top < menu.scrollTop()){
          newRow.scrollIntoView(true);
        }
      }else{
        _actRowIdx = rows.length-1;
        newRow = rows[_actRowIdx];
        newRow.scrollIntoView(false);
      }
  }

  // Add highlight to new active row.
  newRow.classList.add("greyHightlight_active");


}


function saveMenuSelection(rows){
  let selectedOption = rows[_actRowIdx].children[0].children[0].children[1].textContent; //TODO: improve this.
  _ddmClass.emit('optionWasSelected', selectedOption);
  _ddmClass.emit('focusNextField', _tabIndex);
}


function removeDropDownMenu(){
  $('#' + _ddmId).remove();
  //Emit sent back to the form to indicate that it can
  // set the form events back.
  _ddmClass.emit('restoreShortcuts');
}
