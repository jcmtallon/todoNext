const shortcuts = require('./shortcuts');
const addTaksForm = require('./../activeTodos/addTaskForm/addTaskForm');

/**
 * To avoid creating a circular dependency, this module acts
 * as a library of all the different methods and procedures
 * that can be called through a global shortcut in the app.
 * Those shortcuts, compiled each one into an object, are later
 * passed to the shortcuts class in charge of applying and removing
 * the shortcuts from the app.
 */
let openNewTaskForm = {
  keyCode: 81,
  letter: 'q',
  action: () => {addTaksForm.showModal();},
  keydownOff: true
};

//TODO: add other shortcuts for the stat panel, calendar, etc.
let shorcuts = [openNewTaskForm];




class ShortcutFabric{

  /**
   * Passes all shortcut objects from this module to the
   * shortcut module.
   */
  loadAllShortcuts(){
    shortcuts.loadShortcuts(shorcuts);
  }
}

module.exports = new ShortcutFabric();
