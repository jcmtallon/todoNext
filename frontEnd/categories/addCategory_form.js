/*jshint esversion: 6 */
const Form = require('./../forms/form');
const Category = require('./Category');
const DropDownMenu = require('./../forms/dropDownMenu');
const icons = require('./../icons/icons.js');
const colors = require('./../selectables/colors');


// Represent the color picker field drop down menu.
let _colorDDM;


module.exports = class AddCategoryForm extends Form{
  constructor(categoryPage, targetCat){
  super();

  _colorDDM = new DropDownMenu(colors);

  // Chr limit for category field name.
  this.catNameChrLimit = 26;

  // Reference to the category page so we can request it
  // to add and update categories.
  this.categoryPage = categoryPage;

  // If an existing category was passed, adds the category
  // data to the form fields.
  this.preloadedCat = targetCat || '';

  _colorDDM.on('restoreShortcuts', () => this.setFormShortcuts());
  _colorDDM.on('optionWasSelected', (selCol) => updateColorField(this.colorPickField, selCol));
  _colorDDM.on('focusNextField', (index) => this.descriptionField.focus());
  }


  /**
   * Builds form with all its elements and events and appends
   * the form to the document;
   */
  displayForm(){

    // Changes applied to the app document.
    this.removeGlobalShortcuts();

    // Form title text and icon
    let titleText = (this.preloadedCat=='') ? 'Add a new category' : 'Edit this category';
    let titleIcon = icons.categoriesActive();
    this.header = this.buildHeader(titleText, titleIcon);

    // Form controllers
    this.chrTotalTag = buildChrTotalField(this.catNameChrLimit);
    this.chrCountTag = buildChrCountField();
    this.nameField = buildNameField(this.catNameChrLimit,
                                    this.chrTotalTag,
                                    this.chrCountTag);
    this.colorPickField = buildColorPickField();
    this.descriptionField = buildDescriptionField();
    this.saveButton = buildSaveButton(this);
    this.cancelButton = buildCancelButton(this);

    // Put form together
    this.bodyRows = [];
    this.bodyRows.push(buildNameAndColorRow(this.nameField,
                                            this.chrCountTag,
                                            this.chrTotalTag,
                                            this.colorPickField));
    this.bodyRows.push(buildDescriptionRow(this.descriptionField));
    this.bodyRows.push(buildButonRow(this.saveButton,
                                     this.cancelButton));
    this.body = this.buildBody(this.bodyRows);
    this.form = this.buildForm(this.header,
                               this.body);

    // Adds form to document.
    setTimeout( () => {this.setFormShortcuts();}, 100);
    $(document.body).append(this.form);

    this.inputPreloadedCategory();

    this.nameField.focus();
  }



  /**
   * Inputs category deets into user fields
   * if a category was preloaded with the
   * constructor first.
   */
  inputPreloadedCategory(){
    if (this.preloadedCat!=''){

      this.nameField.text(this.preloadedCat.title);

      // Color pick field only accepts color titles, so
      // we have to find the corresponding title for the
      // preloaded category color first.
      let colorObj = colors.find (obj => {
        return obj.color == this.preloadedCat.color;});

      if (colorObj != undefined){
        updateColorField(this.colorPickField, colorObj.title);
      }

      this.descriptionField.text(this.preloadedCat.description);
    }
  }


  /**
   * Sends the input back to the category categoryPage
   * inside a category object after validating the
   * form input.
   */
  save(){
    let isValidInput = this.checkFormInput();
    if (isValidInput){

      if(this.preloadedCat ==''){
        let newCat = this.getCategoryData();
        this.removeForm();
        this.categoryPage.addNewCategory(newCat);

      } else {
        let preCat = this.getCategoryData(this.preloadedCat);
        this.removeForm();
        this.categoryPage.updateCategory(preCat);
      }
    }
  }

  /**
   * Returns a true value after securing that there is
   * an internet connection and that at least the category
   * name has been introduced.
   */
  checkFormInput(){
      // Abort if no internet connection.
      if(!navigator.onLine){
        this.displayErrorMsg('Failed to add item. \nCheck if there is an internet connection.','error','down');
        return;
      }
      // Abort if no name.
      if (this.nameField.text()==''){
        this.displayErrorMsg('Category name cannot be empty.','error','down');
        return;
      }
      return true;
  }


  /**
   * Returns a category object with all the user input.
   */
  getCategoryData(preCat){

    let selectedColor = this.colorPickField.attr('data-value');
    let colorValue ='';
    if (selectedColor!=''){
      let colorObj = colors.find (obj => {
        return obj.title == selectedColor;
      });
      colorValue = colorObj.color;
    }

    let newCat = new Category();
    newCat.title = this.nameField.text();
    newCat.color = colorValue;
    newCat.description = this.descriptionField.text();
    newCat.completedTaskNb = (preCat !== undefined) ? preCat.completedTaskNb : 0;
    newCat.totalTaskNb = (preCat !== undefined) ? preCat.totalTaskNb : 0;
    newCat.id= (preCat !== undefined) ? preCat.id : undefined;

    return newCat;
  }
};

//--------------------------Build fields ----------------------//

function buildChrTotalField(chrLimit) {
  let tag;
  tag = $('<span>', {text:'/'+chrLimit});
  tag.css('color','#6d6c6c');
  tag.css('font-size','12px');
  return tag;
}

function buildChrCountField() {
  let tag;
  tag = $('<span>', {text:'0'});
  tag.css('color','#6d6c6c');
  tag.css('font-size','11px');
  return tag;
}

function buildNameField(chrLimit, totalTag, countTag) {
  let field;
  field = $('<div>', {class: 'form_textInputField'});
  field.attr('placeholder','Category name...');
  field.attr('contenteditable','true');
  field.attr('autocomplete','off');
  field.attr('tabindex','1');
  field.css('cursor','text');
  let fieldWhLimit = addCharacterLimitEvent(field, chrLimit);
  let fieldWhEvent = updateChrCounter(fieldWhLimit, countTag, totalTag, chrLimit);
  return fieldWhEvent;
}

function buildColorPickField() {
  let textHolder = 'Color...';
  let fieldId = 'colorSelectDdm';
  let tabIndex = '2';
  let field = _colorDDM.createDdmWithColors(textHolder, fieldId, tabIndex);
  return field;
}

function buildDescriptionField() {
  let field;
  field = $('<div>', {class: 'form_textInputField'});
  field.attr('placeholder','What are your goals for this category?...');
  field.attr('contenteditable','true');
  field.attr('autocomplete','off');
  field.attr('tabindex','3');
  field.css('min-height','60px');
  return field;
}

function buildSaveButton(formObj) {
  let btn;
  btn = $('<span>', {text:'Save', class:'blue_botton'});
  btn.attr('tabindex','4');
  btn.css('margin-right','9px');
  btn.css('width','52px'); //So it displays the same size as cancelbtn
  let btnWithEvent = loadSaveEvent(btn, formObj);
  return btnWithEvent;
}

function buildCancelButton(formObj) {
  let btn;
  btn = $('<span>', {text:'Cancel', class:'blue_botton'});
  btn.attr('tabindex','5');
  let btnWithEvent = loadCancelEvent(btn, formObj);
  return btnWithEvent;
}




//--------------------------Build body rows ------------------//

function buildNameAndColorRow(name, chrCount, totalCount, colorPick) {
  let trow = $('<tr>',{});
  trow.append(buildCategoryNameCol(name));
  trow.append(buildCategoryNameChrCountCol(chrCount, totalCount));
  trow.append(buildColorPickCol(colorPick));
  return trow;
}

function buildDescriptionRow(description) {
  let trow = $('<tr>',{});
  trow.append(buildDescriptionCol(description));
  return trow;
}

function buildButonRow(saveBtn, cancelBtn) {
  let trow = $('<tr>',{});
  trow.append(buildLowerButtonCol(saveBtn, cancelBtn));
  return trow;
}





//-------------------Build Name and Color Row ------------------//

function buildCategoryNameCol(field){
  let col;
  col = $('<td>', {});
  col.css('width', '100%');
  col.css('padding', '6px');
  col.css('padding-right','1px');
  col.append(field);
  return col;
}

function buildCategoryNameChrCountCol(chrCount, totalCount){
  let col;
  col = $('<td>', {});
  col.css('padding', '6px');
  col.css('min-width','38px');
  col.css('text-align','right');
  col.css('padding-right','15px');
  col.css('padding-left','0px');
  col.append(chrCount)
     .append(totalCount);
  return col;
}

function buildColorPickCol(field){
  let col;
  col = $('<td>', {});
  col.css('padding', '6px');
  col.css('min-width','106px');
  col.append(field);
  return col;
}

function buildDescriptionCol(field){
  let col;
  col = $('<td>', {});
  col.css('width', '100%');
  col.css('padding', '0px 6px 6px');
  col.append(field);
  return col;
}

function buildLowerButtonCol(saveBtn, cancelBtn){
  let col;
  col = $('<td>', {});
  col.css('width', '100%');
  col.css('padding', '12px 6px 0px');
  col.css('text-align', 'right');
  col.append(saveBtn)
     .append(cancelBtn);
  return col;
}







//-------------------Set field events ------------------//

function addCharacterLimitEvent(field, chrLimit){
  field.on('keydown paste', (e) => {
      // Prevent exceeding the character limit.
     if (field.text().length >= chrLimit &&
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
  return field;
}


function updateChrCounter(nameField, countTag, totalTag, limit){

  nameField.on('blur keyup paste input', (e) => {
    let chrNb = nameField.text().length;

    // Update character count tag.
    countTag.text(chrNb);

    // change counter color when reach max
    if (chrNb == limit){
      countTag.css('color','#1551b5');
      totalTag.css('color','#1551b5');
    }else {
      countTag.css('color','#6d6c6c');
      totalTag.css('color','#6d6c6c');
    }
  });
  return nameField;

}


//-------------------Listener events ------------------//


function updateColorField(field, selectedColor){
  field.text(selectedColor);
  field.attr('data-value', selectedColor);
  field.css('text-align','center');
  field.css('color','white');
  field.css('font-weight','bold');
  field.css('border-style','none');

  let colorObj = colors.find (obj => {
    return obj.title == selectedColor;
  });
  field.animate({backgroundColor: colorObj.color}, 500 );
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
