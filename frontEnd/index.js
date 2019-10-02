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

  // Connect to websocket.
  const socket = io();

  // Send back user id to server.
  socket.emit('connected', {
    userId: OPTIONS.userId
  });

  //Listen to any possible disconnect order and if the order
  //comes, logout.
  socket.on('disconnect', function (data) {
      window.open('/users/logout','_self');
  });
});
