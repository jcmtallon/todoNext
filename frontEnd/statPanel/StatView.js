const OPTIONS = require('./../optionHandler/OptionHandler');
const MultiChoiceDropDownMenu = require('./../otherMethods/MultiChoiceDropDownMenu');
const LineChart = require('./LineChart');
const styles = require('./../cssClassNames/cssClassNames');
const moment = require('moment');
const utils = require('./../utilities/utils');


module.exports = class StatView{
  constructor(projects){
    this.projects = projects;

    // Get options for multichoice ddms.
    this.catOptions = this._getOptionsArr(OPTIONS.categories.getCategories());
    this.projOptions = this._getOptionsArr(projects);
    this.habOptions = this._getOptionsArr(OPTIONS.habits.getHabitsWithColors());
  }



  /**
   * Returns a div container with a row for the line chart,
   * another row for the filter buttons and one
   * last row for the piecharts.
   * Only the filter button row comes populated with the buttons,
   * the other two come empty and charts will be appened to them
   * later once the data is received.
   */
  getView(){
    this.row_linechart = this._buildLineChartRow();
    this.row_filters = this._buildFilterRow();
    this.row_piecharts = this._buildPieChartRow();

    return $('<div>', {class: styles.statView.container})
      .append(this.row_linechart)
      .append(this.row_filters)
      .append(this.row_piecharts);
  }


  /**
   * Pre-renders a line chart with the x axis time range
   * calculated based on the received query but with a
   * default range for the y axis and all 0 values for
   * each interval.
   * The porpose of this method is to be able to instantly
   * render the graph structure so we can just simply animate
   * the line path and the axis later once the data is received.
   *
   * @param  {{from: date, until: date}} query
   */
  renderLineChart(query){
    const dataSet = this._parseDataSet(query);
    const provMaxYValue = 10;
    this.lineChart = new LineChart();
    this.lineChart.render(styles.statView.wrapper_linechart, dataSet, provMaxYValue);
  }


  /**
   * Re-rendres lineChart line and axis based on the
   * received point data.
   * @param  {{from: date, until: date}} query
   * @param  {[{Point}]} data
   */
  updateLineChart(query, data){
    const dataSet = this._parseDataSet(query, data);
    this.lineChart.refresh(dataSet);
  }




  /////////////////////////// CHARTS //////////////////////////


  _parseDataSet(query, data = [{points: 0, date: moment()}]){

    let dataSet = [];

    const daysCount = query.until.diff(query.from, 'days');

    // Filters elements with same date.
    function sharesDate(dateToCompare) {
      return function(element) {
          return moment(element.date).isSame(dateToCompare, 'day');
      };
    }

    // Sum element points
    function sumPoints(total, currentValue) {
      return total + currentValue.points;
    }

    let intDate;
    let intValue;

    for (let i = 0; i < daysCount + 1; i++) {
        intDate = moment(query.from).add(i, 'days');
        intValue = data.filter(sharesDate(intDate)).reduce(sumPoints, 0);
        dataSet.push([intDate, intValue]);
    }

   return dataSet;
  }





  ///////////////////// OPTION PARSER METHODS //////////////

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





  ///////////////////// BUILD METHODS /////////////////////

  _buildLineChartRow(){

    this.lineChart_wrapper = $('<div>', {class: styles.statView.wrapper_linechart})
       .addClass('animate slideIn');

    return $('<div>', {class: styles.statView.row_linechart})
     .append(this.lineChart_wrapper);
  }



  _buildFilterRow(){
    this.fld_cats = this._buildMultiChoiceSelector(4, this.catOptions);
    this.fld_projs = this._buildMultiChoiceSelector(5, this.projOptions);
    this.fld_habs = this._buildMultiChoiceSelector(6, this.habOptions);

    this.ele_cats = _wrapField(this.fld_cats, 'Categories');
    this.ele_projs = _wrapField(this.fld_projs, 'Projects');
    this.ele_habs = _wrapField(this.fld_habs, 'Habits');

    return $('<div>', {class: styles.statView.row})
      .append(this.ele_cats)
      .append(this.ele_projs)
      .append(this.ele_habs);
  }



  _buildMultiChoiceSelector(tabIndex, options){
    let fld = $('<input/>',{class: styles.field.field})
           .addClass(styles.statForm.field)
           .addClass(styles.statView.multi_choide_field)
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

  _buildPieChartRow(){

    return $('<div>', {});
  }
};


////////////////////////// OTHER UTILS ///////////////////////////////

function _wrapField(field, labelText){
  let label = $('<span>',{text: labelText, class: styles.field.label})
              .click((e)=>{
                e.stopPropagation();
                field.focus();
              });

  return $('<div>', {class: styles.field.container})
         .addClass(styles.statView.field_container)
         .append(field)
         .append(label);
}
