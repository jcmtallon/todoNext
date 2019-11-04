const EventEmitter = require('events');
const leftMenu = require('./leftMenu/leftMenu');
const topBar = require('./topBar/topBar');

// Component in charge of applying click events to the top bar
// and left menu buttons. It also applies and event so the item
// counters in the left menu are refreshed after specific actions
// from the user.
module.exports = class ContextManager extends EventEmitter{
  constructor(OPTIONS){
    super();
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
