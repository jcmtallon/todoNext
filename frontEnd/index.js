/*jshint esversion: 6 */
const activeTodoPage = require('./activeTodos/activeTodoPage');

const leftMenu = require('./screens/leftMenu/leftMenu');
leftMenu.setMenuEvents();

const topBar = require('./screens/topBar/topBar');
topBar.setTopBar();

const shortcutFabric = require('./shortcuts/shortcutFabric');
shortcutFabric.loadAllShortcuts();

const OPTIONS = require('./optionHandler/OptionHandler.js');


// Not nice, but this was the only way I found so far
// to display the content div correctly from the very
// beginning.
$('#content').css('min-height',$( window ).height()+'px');


$(document).ready(function(){

  activeTodoPage.showPageWithFadeIn();

  // //Set main page Shortcuts
  // shortcuts.setAllGlobalShortcuts();
});
