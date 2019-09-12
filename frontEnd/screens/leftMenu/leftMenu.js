/*jshint esversion: 6 */
const OPTIONS = require('./../../optionHandler/OptionHandler.js');
const ButtonFabric = require('./leftMenuButtonFabric');
const MobileLeftMenu  = require('./mobileLeftMenu');

/**
 * @module
 * Brings together the class in charge of adding click events to the
 * existing left menu buttons, and the class in charge
 * of printing the user custom lists.
 */


let menuIconId = 'top_bar_menu_icon_container';

let counterIds = {
  active : 'lmc_active',
  pending : 'lmc_pending',
  complete : 'lmc_complete',
  habits : 'lmc_habits',
  projects : 'lmc_projects',
  categories : 'lmc_categories',
  toRemeber : 'lmc_toRemember',
  learnings :'lmc_learning',
  lists : 'lmc_lists',
  list1 : 'lmc_list1',
  list2 : 'lmc_list2'
};



class LeftMenu{
  constructor(){
    this.buttonFabric = new ButtonFabric(counterIds);
    this.mobile = new MobileLeftMenu();
  }


  /**
   * Applies all left menu events to the different
   * elements of the menu.
   */
  setMenu(){
    this.buttonFabric.addTopButtons();
    this.buttonFabric.addMiddlebuttons();
    this.buttonFabric.addListButtons();

    this.mobile.setWindowResizeEvent();
    this.mobile.setMenuBtnClickEvent(menuIconId);

    this.refreshItemCounters();
  }

  /**
   *
   */
  get MobileMenu(){
    return this.mobile;
  }


  /**
   * Fetches counter data from local option and
   * refresh menu item counter display.
   */
  refreshItemCounters(){

    let active = $('#' + counterIds.active);
    let pending = $('#' + counterIds.pending);
    let complete = $('#' + counterIds.complete);
    let habits = $('#' + counterIds.habits);
    let projects = $('#' + counterIds.projects);
    let categories = $('#' + counterIds.categories);
    let toRemeber = $('#' + counterIds.toRemeber);
    let learnings = $('#' + counterIds.learnings);
    let lists = $('#' + counterIds.lists);
    let list1 = $('#' + counterIds.list1);
    let list2 = $('#' + counterIds.list2);

    active.text(OPTIONS.activeTasks.getNbOfItems());
    pending.text(OPTIONS.stats.pendingTasks);
    complete.text(OPTIONS.stats.completedTasks);
    habits.text(OPTIONS.habits.getNbOfItems());
    projects.text(OPTIONS.projects.getNbOfItems());
    categories.text(OPTIONS.categories.getNbOfItems());
    toRemeber.text('0');
    learnings.text('0');
    lists.text('0');
    list1.text('0');
    list2.text('0');


  }
}

module.exports = new LeftMenu();
