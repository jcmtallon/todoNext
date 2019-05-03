/*jshint esversion: 6 */
const shortcuts = require('./shortcuts');
const addTaksForm = require('./../forms/add_task_form');


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

let shorcuts = [openNewTaskForm];

class ShortcutFabric{
  constructor(){
  }

  /**
   * Passes all shortcut objects from this module to the
   * shortcut module.
   */
  loadAllShortcuts(){
    shortcuts.loadShortcuts(shorcuts);
  }
}

module.exports = new ShortcutFabric();
