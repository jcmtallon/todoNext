const Form = require('./../forms/form');
const BooleanButton = require('./../forms/booleanButton');
const Hints = require('./../hints/help_hint');
const icons = require('./../icons/icons.js');
const OPTIONS = require('./../optionHandler/OptionHandler');


module.exports = class AccountForm extends Form{
  constructor(){
    super();

    // Tells the Form parent to center the form vertically.
    this.isCentered = true;
    this.formWidth = 400;
  }

  show(){

    this.removeGlobalShortcuts();

    // Build header
    this.header = this.buildHeader('Settings', icons.edit('#1551b5'));

    // Each form section will push their rows to this object.
    this.bodyRows = this._buildBodyRows();

    this.body = this.buildBody(this.bodyRows);
    this.form = this.buildForm(this.header,
                               this.body);

     // Adds form to document.
     setTimeout( () => {this.setFormShortcuts();}, 100);
     $(document.body).append(this.form);

     //Loads a hint into each icon.
     Hints.loadHints('.setting-form_row .hintHolder');
  }


  //--------------------- Build methods -----------------//

  _buildBodyRows(){

    let rows = [];

    rows.push(this._buildTitleRow('Habits'));
    rows.push(this._buildBoolOptionRow('Fixed periods',
                                       1,
                                       'setting-form_fixed-periods',
                                       OPTIONS.logs.getFixedPeriodsVal(),
                                       (value)=>{this.updateFixedPeriods(value);}));

    return rows;
  }

  _buildTitleRow(text) {
    let title = $('<div>', {text: text})
                 .css('text-align', 'center')
                 .css('padding-top','18px')
                 .css('padding-bottom','26px')
                 .css('font-weight', 'bold')
                 .css('font-size','15px');

    let col = $('<td>').append(title);
    return $('<tr>').append(col);
  }


  _buildBoolOptionRow(text, tabIndex, id, value, callback){

    let row = $('<tr>', {class: 'setting-form_row'});

    let labelCol = $('<td>', {text: text, id: id})
                  .addClass('hintHolder')
                  .css('width','100%')
                  .css('padding-left','12px');

    const btnFactory = new BooleanButton('On', icons.onOff);
    let btn = btnFactory.createButtonWithIcon(value, callback);
    btn.attr('tabindex', tabIndex);

    let btnCol = $('<td>').append(btn);

    return row.append(labelCol)
              .append(btnCol);
  }


  //---------------------- Update methods -------------------//

  updateFixedPeriods(value){
    OPTIONS.logs.setFixedPeriodsVal(value);
    OPTIONS.updateDb();
  }
};
