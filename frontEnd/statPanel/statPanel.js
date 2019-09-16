const OPTIONS = require('./../optionHandler/OptionHandler');
const Form = require('./../forms/form');
const MultiChoiceDropDownMenu = require('./../otherMethods/MultiChoiceDropDownMenu');
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
    // Get options for multichoice ddms.
    this.catOptions = this._getOptionsArr(OPTIONS.categories.getCategories());
    this.projOptions = this._getOptionsArr(projects);
    this.habOptions = this._getOptionsArr(OPTIONS.habits.getHabitsWithColors());

    // Build header
    this.header = this.buildHeader('Stats', icons.stats('#1551b5'));
    this.body = this._buildBody();
    this.form = this.buildForm(this.header, this.body);

     // Adds form to document.
     setTimeout( () => {this.setFormShortcuts();}, 100);
     $(document.body).append(this.form);

    // Request default query point data, update query buttons to
    // display the same info and display the query result. 
    const defaultQuery = {
       from: moment().subtract(1,'months').startOf('month'),
       until: moment().endOf('day')
     };


  }

  refresh(){
    this.body.empty();

  }

  //------------------------- Data loading methods --------------------//

  _getOptionsArr(items){

    function applyHightligh(fld, text) {
      if (text!= '' && text!= ' ') {
        fld.addClass(styles.field.field_validInput);
      } else {
        fld.removeClass(styles.field.field_validInput);
      }
    }

    let arr = [];
    $.each(items, (index, item)=>{
      arr.push({
        text: item.title,
        val: item._id,
        color: item.color,
        icon: item.icon,
        action: (fld, selected)=>{
          fld.attr('data-selected', JSON.stringify(selected));
          const inputText = utils.getSelectedInputText(items, selected);
          fld.val(inputText);
          applyHightligh(fld, inputText);
        }
      });
    });
    return arr;
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
    this.fld_cats = this._buildMultiChoiceSelector(3, this.catOptions);
    this.fld_projs = this._buildMultiChoiceSelector(4, this.projOptions);
    this.fld_habs = this._buildMultiChoiceSelector(5, this.habOptions);
    this.fld_until = _buildDateSelectorField(2, this.fld_cats);
    this.fld_from = _buildDateSelectorField(1, this.fld_until);

    this.ele_from = _wrapField(this.fld_from, 'From');
    this.ele_until = _wrapField(this.fld_until, 'Until');
    this.ele_cats = _wrapField(this.fld_cats, 'Categories');
    this.ele_projs = _wrapField(this.fld_projs, 'Projects');
    this.ele_habs = _wrapField(this.fld_habs, 'Habits');

    this.cont_dateSelector = $('<div>', {class: styles.statForm.date_fields_container}).append(this.ele_from).append(this.ele_until);

    this.searchBtn = this._buildSearchBtn();

    return $('<div>', {class: styles.form.body_row})
           .css('padding-top', '34px')
           .append(this.cont_dateSelector)
           .append(this.ele_cats)
           .append(this.ele_projs)
           .append(this.ele_habs)
           .append(this.searchBtn);
  }

  _buildStatRow(){
    return $('<div>', {text: 'TEST', class: styles.form.body_row});
  }


  // TODO: Make a function like the other???
  _buildMultiChoiceSelector(tabIndex, options){
    let fld = $('<input/>',{class: styles.field.field})
           .addClass(styles.statForm.field)
           .addClass(styles.statForm.multi_choide_field)
           .attr('data-selected','')
           .attr('placeholder',' ')
           .attr('autocomplete','off')
           .attr('readonly', true)
           .attr('tabindex', tabIndex);


   function displayMenu(){
     let params ={
       options : options,
       selected: fld.attr('data-selected'),
       width : fld.width() + 12, // 12 represents added padding value.
       triggerHeight: 30,
       root: $('.modal_blackBackground'),
       trigger : fld};
     let ddm = new MultiChoiceDropDownMenu(params);
     ddm.show();
   }

   //If the field is empty, when selecting a date in the datapicker,
   //as the datapicker takes a few instants to add the input, the label
   //animation seems to trigger for a second. To avoid this, we secure
   //that the field at least have one character, in that way, even if the
   //datapicker takes a few instants to start, the animation won't trigger
   //as the field is being detected as populatted.
   fld.focus(()=>{if(fld.val()=='') fld.val(' ');});

   // We get rid of the above white space when focusout.
   // We add a seTimout to wait the datapicker response time, as the reason
   // why the user focused out could be because it clicked on the calendar.
   fld.focusout(()=>{setTimeout( () => {if(fld.val()==' ') fld.val('');}, 200);});

   // Click will automatically focus the input which will trigger the ddm.
   // We add stopPropagation to avoid that this same click triggers the removeMenu
   // event of the ddm.
   fld.click((e)=>{
     e.stopPropagation();
     if ($(`.multichoice`).length == 0) displayMenu();
   });

   fld.on('focus', (e)=>{
     e.preventDefault();
     e.stopPropagation();
     displayMenu();
   });

   return fld;
  }

  _buildSearchBtn(){
    let btn = $('<div>', {text: 'Search', class: styles.btn.btn})
              .addClass(styles.statForm.searchBtn)
              .attr('tabindex', 6);

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
