/*jshint esversion: 6 */
const Form = require('./../forms/form');
const Category = require('./Category');
const DropDownMenu = require('./../forms/dropDownMenu');
const icons = require('./../icons/icons.js');
const colors = require('./../colors/colors');

let _bodyRowId = 'form_bodyRow';

let _catNameField;
let _catNameMaxLength = 34;
let _catChrCountTag;
let _totalChrNumberTag;

let _colorDDM = new DropDownMenu(colors);
let _colorField;

let _descriptField;

let _catFormObj;

let _categoryPage;

module.exports = class AddCategoryForm extends Form{
  constructor(categoryPage){
  super();

  _colorDDM.on('restoreShortcuts', () => this.setFormShortcuts());
  _colorDDM.on('showSelectedColor', (selectedColor) => updateColorField(selectedColor));
  _colorDDM.on('focusNextField', (index) => focusNextIndex(index));
  _catFormObj = this;
  _categoryPage = categoryPage;
  }


  /**
   * Builds form with all its elements and events and appends
   * the form to the document;
   */
  displayForm(){
    this.setTitle('Add a new category');
    this.setTitleIcon(icons.categoriesActive());
    this.setBaseTemplate();
    this.addBodyRows(3,_bodyRowId);
    addControllers();
    setControllerEvents();
    _catNameField.focus();
  }

  save(){
    saveCategory();
  }
};

//--------------------------Build functions ------------------//

function addControllers(){
  let firstRow = $('#' + _bodyRowId + 1);
  firstRow.append(buildCategoryName());
  firstRow.append(buildCategoryNameChrCount());
  firstRow.append(buildColorSelectorField());

  let secondRow = $('#' + _bodyRowId + 2);
  secondRow.append(buildDescriptionField());

  let thridRow = $('#' + _bodyRowId + 3);
  thridRow.append(buildBottomButtons());
}



function buildCategoryName(){
  let col = $('<td>', {});
  col.css('width', '100%');
  col.css('padding', '6px');
  col.css('padding-right','1px');

  _catNameField = $('<div>', {class: 'form_textInputField'});
  _catNameField.attr('placeholder','Category name...');
  _catNameField.attr('contenteditable','true');
  _catNameField.attr('autocomplete','off');
  _catNameField.attr('tabindex','1');
  _catNameField.css('cursor','text');

  col.append(_catNameField);
  return col;
}



function buildCategoryNameChrCount(){

  let col = $('<td>', {});
  col.css('padding', '6px');
  col.css('min-width','38px');
  col.css('text-align','right');
  col.css('padding-right','15px');
  col.css('padding-left','0px');


  _catChrCountTag = $('<span>', {text:'0'});
  _catChrCountTag.css('color','#6d6c6c');
  _catChrCountTag.css('font-size','11px');

  _totalChrNumberTag = $('<span>', {text:'/'+_catNameMaxLength});
  _totalChrNumberTag.css('color','#6d6c6c');
  _totalChrNumberTag.css('font-size','12px');

  col.append(_catChrCountTag)
     .append(_totalChrNumberTag);
  return col;
}



function buildColorSelectorField(){

  let col = $('<td>', {});
  col.css('padding', '6px');
  col.css('min-width','106px');

  let textHolder = 'Color...';
  let fieldId = 'colorSelectDdb';
  let tabIndex = '2';
  _colorField = _colorDDM.createDdmWithColors(textHolder, fieldId, tabIndex);

  col.append(_colorField);
  return col;
}




function buildDescriptionField(){

  let leftCol = $('<td>', {});
  leftCol.css('width', '100%');
  leftCol.css('padding', '0px 6px 6px');

  _descriptField = $('<div>', {class: 'form_textInputField'});
  _descriptField.attr('placeholder','What are your goals for this category?...');
  _descriptField.attr('contenteditable','true');
  _descriptField.attr('autocomplete','off');
  _descriptField.attr('tabindex','3');
  _descriptField.css('min-height','60px');

  leftCol.append(_descriptField);
  return leftCol;
}




function buildBottomButtons(){

  let uniqueCol = $('<td>', {});
  uniqueCol.css('width', '100%');
  uniqueCol.css('padding', '12px 6px 0px');
  uniqueCol.css('text-align', 'right');

  let okBtn = $('<span>', {text:'Save', class:'blue_botton'});
  okBtn.css('margin-right','9px');
  okBtn.css('width','52px'); //So it displays the same size as cancelbtn
  let cancelBtn = $('<span>', {text:'Cancel', class:'blue_botton'});

  let cancelBtnWtEvent = loadCancelEvent(cancelBtn);
  let okBtnWtEvent = loadSaveEvent(okBtn);

  uniqueCol.append(okBtnWtEvent)
           .append(cancelBtnWtEvent);
  return uniqueCol;
}


//--------------------------Set events ------------------//

function setControllerEvents(){
  setCategoryNameFieldEvent();
}



function setCategoryNameFieldEvent(){
  _catNameField.on('keydown paste', (e) => {
      // Prevent exceeding the character limit.
     if (_catNameField.text().length >= _catNameMaxLength &&
        e.keyCode != 9 &&  // tab
        e.keyCode != 8 &&  //back space
        e.keyCode != 37 && // left arrow
        e.keyCode != 38 && // up
        e.keyCode != 39 && // right
        e.keyCode != 40 && // down
        e.keyCode != 46) { // delete
         e.preventDefault();
     }
  });

  _catNameField.on('blur keyup paste input', (e) => {
    let currentChrNb = _catNameField.text().length;

    // Update character count tag.
    _catChrCountTag.text(currentChrNb);

    // change counter color when reach max
    if (_catNameMaxLength == currentChrNb){
      _catChrCountTag.css('color','#1551b5');
      _totalChrNumberTag.css('color','#1551b5');
    }else {
      _catChrCountTag.css('color','#6d6c6c');
      _totalChrNumberTag.css('color','#6d6c6c');
    }


  });
}



function updateColorField(selectedColor){
  _colorField.text(selectedColor);
  _colorField.attr('data-value', selectedColor);
  _colorField.css('text-align','center');
  _colorField.css('color','white');
  _colorField.css('font-weight','bold');
  _colorField.css('border-style','none');


  let colorObj = colors.find (obj => {
    return obj.title ==selectedColor;
  });

  _colorField.animate({backgroundColor: colorObj.color}, 500 );
}


function focusNextIndex(currentIndex){
  if (currentIndex == 2){
    _descriptField.focus();
  }
}


function loadCancelEvent(btn){
  btn.on('click',(e) => {
    e.stopPropagation();
    _catFormObj.removeForm();
  });
  return btn;
}



function loadSaveEvent(btn){
  btn.on('click',(e) => {
    e.stopPropagation();
    saveCategory();
  });
  return btn;
}




function saveCategory(){
  let isValidInput = checkFormInput();
  if (isValidInput){
    let newCat = getNewCategory();
    _catFormObj.removeForm();
    _categoryPage.addNewCategory(newCat);
  }
}


function checkFormInput(){
  // Abort if no internet connection.
  if(!navigator.onLine){
    _catFormObj.displayErrorMsg('Failed to add item. \nCheck if there is an internet connection.','error','down');
    return;
  }
  // Abort if no name.
  if (_catNameField.text()==''){
    _catFormObj.displayErrorMsg('Category name cannot be empty.','error','down');
    return;
  }
  return true;
}




function getNewCategory(){
  let newCat = new Category();
  newCat.title = _catNameField.text();
  newCat.color = _colorField.attr('data-value');
  newCat.description = _descriptField.text();
  newCat.completedTaskNb = 0;
  newCat.totalTaskNb = 0;
  return newCat;
}
