/*jshint esversion: 9 */
const EventEmitter = require('events');
const leftMenu = require('./leftMenu/leftMenu');
const topBar = require('./topBar/topBar');


/**
 *
 */
module.exports = class ContextManager extends EventEmitter{
  constructor(OPTIONS){
    super();
    // TODO: update options always through main option class only?
    OPTIONS.on('updateScreen', () => this.refreshScreens());
    OPTIONS.categories.on('updateScreen', () => this.refreshScreens());
    OPTIONS.projects.on('updateScreen', () => this.refreshScreens());
    OPTIONS.habits.on('updateScreen', () => this.refreshScreens());
  }


  /**
   * Builds and displays left menu.
   */
  setLeftMenu(){
    leftMenu.setMenu();
  }


  /**
   * Builds and displays top bar.
   */
  setTopBar(){
    topBar.setTopBar();
  }


  /**
   * Refreshes left menu counter data.
   */
  refreshScreens(){
    leftMenu.refreshItemCounters();
  }
};
