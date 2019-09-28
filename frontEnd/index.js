const activeTaskPage = require('./activeTodos/activeTaskPage');

const OPTIONS = require('./optionHandler/OptionHandler.js');

const shortcutFabric = require('./shortcuts/shortcutFabric');
shortcutFabric.loadAllShortcuts();

const ContextMenu = require('./screens/contextManager');
const cMenu = new ContextMenu(OPTIONS);
cMenu.setLeftMenu();
cMenu.setTopBar();

$(document).ready(function(){

  activeTaskPage.checkHabits();
  activeTaskPage.showPageWithFadeInAndHightlights();

  // //Set main page Shortcuts
  // shortcuts.setAllGlobalShortcuts();
});
