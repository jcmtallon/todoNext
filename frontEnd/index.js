/*jshint esversion: 6 */
const activeTaskPage = require('./activeTodos/activeTaskPage');

const OPTIONS = require('./optionHandler/OptionHandler.js');

const shortcutFabric = require('./shortcuts/shortcutFabric');
shortcutFabric.loadAllShortcuts();

const ContextMenu = require('./screens/contextManager');
const cMenu = new ContextMenu(OPTIONS);
cMenu.setLeftMenu();
cMenu.setTopBar();

// Not nice, but this was the only way I found so far
// to display the content div correctly from the very
// beginning.
$('#content').css('min-height',$( window ).height()+'px');


$(document).ready(function(){

  activeTaskPage.checkHabits();
  activeTaskPage.showPageWithFadeInAndHightlights();

  // //Set main page Shortcuts
  // shortcuts.setAllGlobalShortcuts();
});
