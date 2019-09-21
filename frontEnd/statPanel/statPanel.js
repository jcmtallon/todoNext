const OPTIONS = require('./../optionHandler/OptionHandler');
const Form = require('./../forms/form');
const StatView = require('./StatView');
const icons = require('./../icons/icons.js');
const styles = require('./../cssClassNames/cssClassNames');
const utils = require('./../utilities/utils');
const moment = require('moment');


module.exports = class StatPanel extends Form{
  constructor(){
    super();

    // Tells the Form parent to center the form vertically.
    this.fullWidth = true;
    this.content = 'tasks';
  }

  async show(projects){

    // Build header
    this.header = this.buildHeader('Stats', icons.stats('#1551b5'));
    this.body = this._buildBody();
    this.form = this.buildForm(this.header, this.body);

    // By default we request data from the beginning of the previous month
    // until the end of today.
    const defaultQuery = {
       from: moment().subtract(1,'months').startOf('month'),
       until: moment().endOf('day')
     };

     // We update the date pickers with the query values.
     this._updateDateFields(defaultQuery);

     // Adds form to document.
     setTimeout( () => {this.setFormShortcuts();}, 100);
     $(document.body).append(this.form);


     // Attach new stat view object to form.
     const statView = new StatView(projects);
     this.statRow.append(statView.getView());

     // Render empty line chart.
     statView.renderLineChart(defaultQuery);

     const data = await OPTIONS.points.getPoints(defaultQuery);
     statView.updateLineChart(defaultQuery, data.points);
  }


  // ------------------------ Form updating methods --------------------//

  _updateDateFields(query){
    this.fld_until.val(query.until.format("D MMM, YY"));
    this.fld_from.val(query.from.format("D MMM, YY"));
    utils.highlighWhenValidDate(this.fld_until);
    utils.highlighWhenValidDate(this.fld_from);
  }

  //------------------------- Build methods ----------------------------//


  _buildBody(){
    this.searchRow = this._buildSearchRow();
    this.statRow = this._buildStatRow();

    return $('<div>', {class: styles.form.body_wrapper})
            .append(this.searchRow)
            .append(this.statRow);
  }


  _buildSearchRow(){
    this.btn_search = this._buildSearchBtn();
    this.fld_until = _buildDateSelectorField(2, this.btn_search);
    this.fld_from = _buildDateSelectorField(1, this.fld_until);

    this.ele_from = _wrapField(this.fld_from, 'From');
    this.ele_until = _wrapField(this.fld_until, 'Until');

    this.cont_searchFields = $('<div>', {class: styles.statForm.searchFields_container})
                             .append(this.ele_from)
                             .append(this.ele_until)
                             .append(this.btn_search);

    return $('<div>', {class: styles.form.body_row})
           .addClass(styles.statForm.searchRow)
           .append(this.cont_searchFields);
  }

  _buildStatRow(){
    return $('<div>', {class: styles.form.body_row});
  }

  _buildSearchBtn(){
    let btn = $('<div>', {text: 'Search', class: styles.btn.btn})
              .addClass(styles.statForm.searchBtn)
              .attr('tabindex', 3);

    return btn;
  }

};



//------------------------- Private Functions ----------------------------//

function _buildDateSelectorField(tabIndex, nextField){
  let field =  $('<input>', {class: styles.field.field})
              .addClass(styles.statForm.field)
              .addClass(styles.statForm.date_field)
              .attr('placeholder',' ')
              .attr('autocomplete','off')
              .attr('tabindex', tabIndex)
              .datepicker({ minDate: "-5Y -10D", maxDate: 0 })
              .datepicker( "option", "dateFormat","d M, y");

  //If the field is empty, when selecting a date in the datapicker,
  //as the datapicker takes a few instants to add the input, the label
  //animation seems to trigger for a second. To avoid this, we secure
  //that the field at least have one character, in that way, even if the
  //datapicker takes a few instants to start, the animation won't trigger
  //as the field is being detected as populatted.
  field.focus((e)=>{
    if(field.val()=='') field.val(' ');
  });

  // We get rid of the above white space when focusout.
  // We add a seTimout to wait the datapicker response time, as the reason
  // why the user focused out could be because it clicked on the calendar.
  field.focusout((e)=>{setTimeout( () => {
    if(field.val()==' ') field.val('');
    }, 200);
  });

  // Highlights input when the user inserts a valid date and jump to next element.
  field.on("input", () => {utils.highlighWhenValidDate(field, nextField);});
  field.on("change", () => {utils.highlighWhenValidDate(field, nextField);});

  return field;
}

function _wrapField(field, labelText){
  let label = $('<span>',{text: labelText, class: styles.field.label})
              .click((e)=>{
                e.stopPropagation();
                field.focus();
              });

  return $('<div>', {class: styles.field.container})
         .addClass(styles.statForm.field_container)
         .append(field)
         .append(label);
}
