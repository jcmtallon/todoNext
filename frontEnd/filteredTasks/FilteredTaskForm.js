const OPTIONS = require('./../optionHandler/OptionHandler');
const Form = require('./../forms/form');
const DropDownMenu = require('./../forms/dropDownMenu');
const taskStatuses = require('./../selectables/taskStatuses');
const icons = require('./../icons/icons.js');


module.exports = class FilteredTaskForm extends Form{
  constructor(renderPage, projectOptions){
      super();
      this.renderPage = renderPage;

      // Tells the Form parent to center the form vertically.
      this.isCentered = true;
      this.formWidth = 400;

      //Set and populate drop down menus.
      this.statusDDM = new DropDownMenu(taskStatuses);
      this.catDDM = new DropDownMenu(OPTIONS.categories.getCategories());
      this.projDDM = new DropDownMenu(projectOptions);
      this.habitDDM = new DropDownMenu(OPTIONS.habits.getHabitsWithColors());

      //Set ddm listeners
      this.statusDDM.on('restoreShortcuts', () => this.setFormShortcuts());
      this.catDDM.on('restoreShortcuts', () => this.setFormShortcuts());
      this.projDDM.on('restoreShortcuts', () => this.setFormShortcuts());
      this.habitDDM.on('restoreShortcuts', () => this.setFormShortcuts());

      this.statusDDM.on('optionWasSelected', (selection) => this._updateField(this.statusField, selection, selection));
      this.catDDM.on('optionWasSelected', (selection) => this._updateField(this.categoryField, OPTIONS.categories.getCategoryNameById(selection), selection));
      this.projDDM.on('optionWasSelected', (selection) => this._updateField(this.projectField, OPTIONS.projects.getNameFromAllProjects(selection), selection));
      this.habitDDM.on('optionWasSelected', (selection) => this._updateField(this.habitField, OPTIONS.habits.getHabitNameById(selection), selection));
  }


  displayForm(){

    this.removeGlobalShortcuts();

    // Build header
    this.header = this.buildHeader('Select filters', icons.filters('#1551b5'));

    // Build filds
    this.statusField = this._buildDdmField('statusDDM','Status', 'statusSelectDdm', 1, 'icons');
    this.categoryField = this._buildDdmField('catDDM', 'Category', 'categorySelectDdm', 2, 'colors');
    this.projectField = this._buildDdmField('projDDM', 'Project', 'projectSelectDdm', 3, 'icons');
    this.habitField = this._buildDdmField('habitDDM', 'Habit', 'habitSelectDdm', 4, 'colors');

    // Build buttons
    this.saveButton = this._buildSaveButton();
    this.cancelButton = this._buildCancelButton();

    // Put form together
    this.bodyRows = [];
    this.bodyRows.push(this._buildRow(this.statusField),
                       this._buildRow(this.categoryField),
                       this._buildRow(this.projectField),
                       this._buildRow(this.habitField),
                       this._buildButtonRow(this.saveButton, this.cancelButton));

    this.body = this.buildBody(this.bodyRows);
    this.form = this.buildForm(this.header,
                               this.body);

    // Adds form to document.
    setTimeout( () => {this.setFormShortcuts();}, 100);
    $(document.body).append(this.form);
  }

  save(){
    let searchQuery = this._getInput();
    this.removeForm();
    this.renderPage({fadeIn: false, scrollToTop: true}, searchQuery);
  }


  // ----------------------- Build methods --------------------------//

  _getInput(){

    const status = this._convertStatusToValue(this.statusField.attr('data-value'));
    const category = this.categoryField.attr('data-value');
    const project = this.projectField.attr('data-value');
    const habit = this.habitField.attr('data-value');

    let query = {pageNb: 1};

    query.status = (status!= null) ? status : undefined;
    query.categoryId = (category!= null && category!='') ? category : undefined;
    query.projectId = (project!= null && project!='') ? project : undefined;
    query.habitId = (habit!= null && habit!='') ? habit : undefined;

    return query;
  }

  _buildDdmField(ddmName, placeholder, id, index, type){
    switch (type) {
      case 'icons':
        return this[ddmName].createDdmWithIcons(placeholder, id, index);
      default:
        return this[ddmName].createDdmWithColors(placeholder, id, index);
    }
  }

  _buildSaveButton(){
  return $('<span>', {text:'Save', class:'blue_botton'})
              .attr('tabindex','7')
              .css('margin-right','9px')
              .css('width','52px') //So it displays the same size as cancelbtn
              .on('click',(e) => {
                e.stopPropagation();
                this.save();
              });
  }

  _buildCancelButton(){
    return $('<span>', {text:'Cancel', class:'blue_botton'})
              .attr('tabindex','8')
              .on('click',(e) => {
                e.stopPropagation();
                this.removeForm();
              });
  }

  _buildRow(field) {
    let col = $('<td>').append(field)
              .css('padding', '16px 12px 0px');
    return $('<tr>').append(col);
  }

  _buildButtonRow(saveBtn, cancelBtn){
    let col;
    col = $('<td>', {});
    col.css('width', '100%');
    col.css('padding', '30px 12px 0px');
    col.css('text-align', 'right');
    col.append(saveBtn)
       .append(cancelBtn);

    return $('<tr>',{}).append(col);
  }



  //--------------------------Input update ----------------------------------//

  _updateField(field, text, data){
    field.text(text);
    field.attr('data-value', data);
    field.css('text-align','center');
    field.css('color','#1551b5');
    field.css('font-weight','bold');
    field.css('background-color','#f4f4f4');
  }



  //------------------------- Data conversion ---------------------------//

  _convertStatusToValue(status){
    let statusObj = taskStatuses.find (obj => {return obj.title == status;});
    if (statusObj != undefined){
      return statusObj.id;
    }
  }
};
