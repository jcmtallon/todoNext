const OPTIONS = require('./../optionHandler/OptionHandler');
const Form = require('./../forms/form');
const CalendarView = require('./CalendarView');
const icons = require('./../icons/icons.js');
const styles = require('./../cssClassNames/cssClassNames');
const utils = require('./../utilities/utils');
const activeTaskPage = require('./../activeTodos/activeTaskPage');
const shortcuts = require('./../shortcuts/shortcuts');
const moment = require('moment');

module.exports = class CalendarPanel extends Form{
  constructor(){
    super();

    // Tells the Form parent to center the form vertically.
    this.fullWidth = true;
    this.fullWidthMobile = true;

    // States
    this.targetMonth = moment();
    this.isFullMode = false;
    this.showFilters = false;
  }

  show(){

    // Build header
    this.header = this.buildHeader('Calendar', icons.calendar('#1551b5'));
    this.body = this._buildBody();
    this.form = this.buildForm(this.header, this.body);

    // Adds form to document.
    setTimeout( () => {this.setFormShortcuts();}, 100);
    $(document.body).append(this.form);

    // Render calendar
    this.calendar = new CalendarView();
    this.calendarRow.append(this.calendar.getCalendarFor(this.targetMonth, this.isFullMode, this.showFilters));

    // To change to mobile mode if window is resized to that size
    this.addResizeEvent();
  }

  removeForm(){
    this._closeForm();
  }



  //------------------------- Build methods ----------------------------//

  _buildBody(){
    this.searchRow = this._buildSearchRow();
    this.calendarRow = this._buildCalendarRow();

    return $('<div>', {class: styles.form.body_wrapper})
            .append(this.searchRow)
            .append(this.calendarRow);
  }

  _buildSearchRow(){
    // Month selection elements
    this.prevMonthBtn = $('<div>', {text:'<', class: styles.calendarForm.searchBtn}).click((e)=>{this.addMonth(e, -1);});
    this.nextMonthBtn = $('<div>', {text:'>', class: styles.calendarForm.searchBtn}).click((e)=>{this.addMonth(e, 1);});
    this.monthLabel = $('<div>', {class: styles.calendarForm.dateLabel});
    this.updateMonthLabel();

    this.searchBtn_container = $('<div>', {class: styles.calendarForm.searchBtns_container})
                             .append(this.prevMonthBtn)
                             .append(this.nextMonthBtn)
                             .append(this.monthLabel);

    //Show options
    this.maximizeModeIcon = icons.maximize('#d4d6d5');
    this.maximizeIconHolder = $('<div>', {id: 'calendar_maximize-icon', class: styles.calendarForm.optIconHolder}).append(this.maximizeModeIcon).click((e)=>{this.toggleFullMode(e);});

    this.showFiltersIcon = icons.filters('#d4d6d5');
    this.showFiltersIconHolder = $('<div>', {class: styles.calendarForm.optIconHolder}).append(this.showFiltersIcon).click((e)=>{this.toggleFilters(e);});

    this.optionContainer = $('<div>', {class: styles.calendarForm.optContainer})
                          .append(this.maximizeIconHolder)
                          .append(this.showFiltersIconHolder);

    this.updateFullModeIcon();
    this.updateFiltersIcon();

    return $('<div>', {class: styles.form.body_row})
            .addClass(styles.calendarForm.searchRow)
            .append(this.searchBtn_container)
            .append(this.optionContainer);
  }

  // Empty div that we can empty and reuse to place the different
  // rerenders of the calendar component.
  _buildCalendarRow(){
    return $('<div>', {id: 'calendar-row', class: styles.form.body_row});
  }


  //--------------------- Other methods ---------------------//

  // Updates targetMonth state value and rerenders the calendar lable
  // and the calendar component.
  addMonth(e, val){

    e.preventDefault();
    e.stopPropagation();

    this.targetMonth.add(val, 'months');
    this.updateMonthLabel();

    this.refreshCalendarView();
  }

  // Updates month label with most recent state.
  updateMonthLabel(){
    this.monthLabel.text(this.targetMonth.format('MMMM YYYY'));
  }

  // Toggles full mode value and updates button style.
  toggleFullMode(e){
    this.isFullMode = !this.isFullMode;
    this.updateFullModeIcon();
    this.refreshCalendarView();
  }

  // Toggles maximize btn style.
  updateFullModeIcon(){
    if(this.isFullMode){
      this.maximizeIconHolder.addClass('calendar-form_option-icon-holder--active');
    }else{
      this.maximizeIconHolder.removeClass('calendar-form_option-icon-holder--active');
    }
  }

  // Toggles filter display value and updates button style.
  toggleFilters(e){
    this.showFilters = !this.showFilters;
    this.updateFiltersIcon();
    this.refreshCalendarView();
    if(this.showFilters){ this.calendar.showFilters();
                   }else{ this.calendar.hideFilters();}
  }

  // Toggles filter btn style.
  updateFiltersIcon(){
    if(this.showFilters){
      this.showFiltersIconHolder.addClass('calendar-form_option-icon-holder--active');
    }else{
      this.showFiltersIconHolder.removeClass('calendar-form_option-icon-holder--active');
    }
  }

  refreshCalendarView(){
    this.calendar.refreshCalendarFor(this.targetMonth, this.isFullMode, this.showFilters);
  }

  // Removes fullMode when resized to mobile resolution.
  addResizeEvent(){
    $(window).on('resize', (e) => {
      if($(window).width() < 950 && this.isFullMode){
        this.isFullMode = false;
        this.updateFullModeIcon();
        this.refreshCalendarView();
      }else{
        this.refreshCalendarView();
      }
    });
  }


  _closeForm(){
    //Remove all open ddm first.
    $('.ddm_Container').remove();
    $(document.body).removeClass('modal-open');

    this.form.remove();
    // Removes any main page shortcuts that could affect
    // this form (if there are) and sets new ones.
    shortcuts.removeAllGlobalShortcuts();
    shortcuts.setAllGlobalShortcuts();

    //Reload mainPage
    activeTaskPage.checkHabits();
    activeTaskPage.showPage();

  }

};
