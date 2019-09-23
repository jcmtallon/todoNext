const OPTIONS = require('./../optionHandler/OptionHandler');
const MultiChoiceDropDownMenu = require('./../otherMethods/MultiChoiceDropDownMenu');
const LineChart = require('./LineChart');
const PieChart = require('./PieChart');
const styles = require('./../cssClassNames/cssClassNames');
const moment = require('moment');
const utils = require('./../utilities/utils');


module.exports = class StatView{
  constructor(projects){
    this.projects = projects;

    this.data = [];
    this.query = {};
    this.intervalType = '';

    // Get options for multichoice ddms.
    this.catOptions = this._getOptionsArr(OPTIONS.categories.getCategories());
    this.projOptions = this._getOptionsArr(projects);
    this.habOptions = this._getOptionsArr(OPTIONS.habits.getHabitsWithColors());
  }



  /**
   * Returns a div container with a row for the line chart,
   * an absolute floating row for the period buttons,
   * another row for the filter buttons and one
   * last row for the piecharts.
   * Only the filter button row comes populated with the buttons,
   * the other two come empty and charts will be appened to them
   * later once the data is received.
   */
  getView(){
    this.row_periodBtns = this._buildPeriodBtnRow();
    this.row_linechart = this._buildLineChartRow();
    this.row_filters = this._buildFilterRow();
    this.row_piecharts = this._buildPieChartRow();

    return $('<div>', {class: styles.statView.container})
      .append(this.row_periodBtns)
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
   * It automatically selects the interval type
   * that better displays the amount of data received.
   * @param  {{from: date, until: date}} query
   */
  renderLineChart(query){
    this.intervalType = (this.intervalType!='') ? this.intervalType : this._calculateType(query);
    this._updatePeriodBtsn();
    const dataSet = this._parseDataSet(query);
    const provMaxYValue = 5;
    this.lineChart = new LineChart();
    this.lineChart.render(styles.statView.wrapper_linechart, dataSet, this.intervalType, provMaxYValue);
  }


  /**
   * Re-rendres lineChart line and axis based on the
   * received point data.
   * @param  {{from: date, until: date}} query
   * @param  {[{Point}]} data
   */
  updateLineChart(query, data){
    this.data = data;
    this.query = query;
    const dataSet = this._parseDataSet(query, data);
    this.lineChart.refresh(dataSet);
  }


  emptyLineChart(){
    this.lineChart_wrapper.empty();
  }

  renderCategoyPiechart(query){
    // const dataSet = [
    //   ['A', 25, "#98abc5"],
    //   ['B', 3, "#8a89a6"],
    //   ['C', 5, "#7b6888"],
    //   ['D', 9, "#6b486b"],
    // ];
    const dataSet = this._parsePieDataSet(query);
    this.catPie = new PieChart();
    this.catPie.render('stat-view_cat-pie', dataSet);
  }

  updatedCategoryPieChart(query, data){

  }




  /////////////////////////// CHARTS //////////////////////////

  _calculateType(query){
    const daysCount = query.until.diff(query.from, 'day');
    const weekCount = Math.round(daysCount/7);
    const chartWidth = this.lineChart_wrapper.width();
    const pxPerInt = 18;

    switch (true) {
      case (weekCount * pxPerInt) > chartWidth:
        return 'month';
      case (daysCount * pxPerInt) > chartWidth:
        return 'week';
      default:
        return 'day';
    }
  }


  _parseDataSet(query, data = [{points: 0, date: moment()}]){

    let dataSet = [];

    // Save into local variable so the filter function can access it.
    const type = this.intervalType;　

    const intervalCount = query.until.diff(query.from, type + 's');
    // const daysCount = query.until.diff(query.from, 'days');

    //Filter categories
    data = this._filterItems(data, this.fld_cats, this.catOptions, 'categoryId');
    data = this._filterItems(data, this.fld_projs, this.projOptions, 'projectId');
    data = this._filterItems(data, this.fld_habs, this.habOptions, 'habitId');

    // Filters elements with same date.
    function sharesDate(dateToCompare) {
      return function(element) {
          return moment(element.date).isSame(dateToCompare, type);
      };
    }

    // Sum element points
    function sumPoints(total, currentValue) {
      return total + currentValue.points;
    }

    let intDate;
    let intValue;

    for (let i = 0; i < intervalCount + 1; i++) {
        intDate = moment(query.from).add(i, type + 's');
        intValue = data.filter(sharesDate(intDate)).reduce(sumPoints, 0);
        dataSet.push([intDate, intValue]);
    }

   return dataSet;
  }


  _filterItems(data, field, options, propertyName){

    // Get array of booleans (true = options was selected)
    const inputStr = field.attr('data-selected');
    const inputArr = (inputStr == '') ? [] : JSON.parse(inputStr);

    // Generate array of selected ids
    const ids = [];
    $.each(inputArr, (index, value)=>{
      if (value == true) {ids.push(options[index].val);}
    });

    // No filtering if no filter option was selected.
    if (ids.length == 0){
      return data;
    }else{
      return data.filter(filterIds);
    }

    //Filter function
    function filterIds(element){
      return ids.includes(element[propertyName]);
    }
  }


  _parsePieDataSet(query, data = [{points: 0, date: moment(), categoryId: '', projectId: '', habitId: ''}]){

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

          //Update field state and look
          fld.attr('data-selected', JSON.stringify(selected));
          const inputText = utils.getSelectedInputText(items, selected);
          fld.val(inputText);
          applyHightligh(fld, inputText);

          // Refresh line chart
          this.updateLineChart(this.query, this.data);
        }
      });
    });
    return arr;
  }





  ///////////////////// BUILD METHODS /////////////////////

  _buildPeriodBtnRow(){

    this.btn_daily = this._buildPeriodBtn('Days', 'day');
    this.btn_weekly = this._buildPeriodBtn('Weeks', 'week');
    this.btn_monthly = this._buildPeriodBtn('Months', 'month');

    let row = $('<div>', {class: styles.statView.row_periodBtns})
     .append(this.btn_daily)
     .append(this.btn_weekly)
     .append(this.btn_monthly);

    //Don't show buttons when there is no enough space.
    if($(window).width() < 550){
      row.hide();
    }

    $(window).on('resize.' + 'statFormPeriodBtns', (e) =>{
      if($(window).width() < 550){
        row.fadeOut(500);
      }else{
        row.fadeIn(500);
      }
    });

    return row;
   }

   _buildPeriodBtn(text, value){
     let btn = $('<div>', {text: text, class: styles.btn.btn})
               .attr('data-value', value)
               .addClass(styles.btn.selectBtn)
               .addClass(styles.btn.selectBtn + '--off');

     btn.click((e)=>{
         e.stopPropagation();
         if (btn.hasClass(styles.btn.selectBtn + '--off')){
           this.intervalType = btn.attr('data-value');
           this.emptyLineChart();
           this.renderLineChart(this.query);
           this.updateLineChart(this.query, this.data);
         }
         });
     return btn;
   }

   _updatePeriodBtsn(){
     this.btn_daily.addClass(styles.btn.selectBtn + '--off');
     this.btn_weekly.addClass(styles.btn.selectBtn + '--off');
     this.btn_monthly.addClass(styles.btn.selectBtn + '--off');

     switch (this.intervalType) {
       case 'month':
         this.btn_monthly.removeClass(styles.btn.selectBtn + '--off');
         break;
       case 'week':
         this.btn_weekly.removeClass(styles.btn.selectBtn + '--off');
         break;
       default:
         this.btn_daily.removeClass(styles.btn.selectBtn + '--off');

     }
   }

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

    this.catPie_secContainer = this._buildPieSection('stat-view_cat-pie');
    this.projPie_secContainer = this._buildPieSection('stat-view_proj-pie');
    this.habPie_secContainer = this._buildPieSection('stat-view_hab-pie');

    return $('<div>', {class: styles.statView.row})
           .append(this.catPie_secContainer)
           .append(this.projPie_secContainer)
           .append(this.habPie_secContainer);
  }

  _buildPieSection(className){
    let container = $('<div>',{class: styles.statView.pie_secContainer})
                    .addClass(className);
    return container;
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
