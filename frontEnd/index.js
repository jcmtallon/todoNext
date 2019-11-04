// Page component loaded by default when opening
// the main view of the application.
const activeTaskPage = require('./activeTodos/activeTaskPage');

// This wrongly named OPTIONS object acts as the store where
// all the active task, active project, category, habit and other
// state information is saved and managed.
// All this data is passed from the backend to the frontend using the attribute of
// a span element at the very end of the main ejs view.
// As soon as the DOM finished parsing, we retrieve the object inside that the span
// attribute, remove the span from the DOM and pass all that data to this OPTIONS object.
const OPTIONS = require('./optionHandler/OptionHandler.js');

// Component in charge of applying and removing shortcuts
// global shortcuts to the application depending on the current screen.
const shortcutFabric = require('./shortcuts/shortcutFabric');
shortcutFabric.loadAllShortcuts();

// Component in charge of applying click events to the top bar
// and left menu buttons. It also applies and event so the item
// counters in the left menu are refreshed after specific actions
// from the user.
const ContextMenu = require('./screens/contextManager');
const cMenu = new ContextMenu(OPTIONS);
cMenu.setLeftMenu();
cMenu.setTopBar();


$(document).ready(function(){

  // Checks if there are pending habit tasks that need to be generated and,
  // if that is the case, generates those habit tasks and adds them to the
  // OPTIONS object before rendering the active tasks page.
  activeTaskPage.checkHabits();

  // Displays page with fade in effect and highlight effects for those
  // newly added habit tasks.
  activeTaskPage.showPageWithFadeInAndHightlights();


  // Connect to websocket.
  const socket = io();


  // Send back user id to backend so the backend can check if the same
  // user has any other session opened in a different device or tab.
  socket.emit('connected', {
    userId: OPTIONS.userId
  });

  // If the backend detected that the same user has opened a new session in
  // a different tab or device, it requests this session to log out itself
  // to avoid multiple sessions happening at the same time. 
  socket.on('disconnect', function (data) {
      window.open('/users/logout','_self');
  });
});
