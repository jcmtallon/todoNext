/*jshint esversion: 6 */
const ContextMenu = require('./../menus/menu');
const icons = require('./../icons/icons.js');


module.exports = class ActiveTodoMenu extends ContextMenu{
  constructor(trigger, id, listMethods){
    super(trigger, id);
    // Provides the different category list methods that
    // will be attached to each button action.
    this.listMethods = listMethods;

    // Each object attribute represents a button
    this.options = {
      progress:{
        text: 'Progress',
        src: icons.progress(),
        fun: (id) => {alert('Progress. Cooming soon');}
      },
      notes:{
        text: 'Notes',
        src: icons.notes(),
        fun: (id) => {this.listMethods.openNoteEditor(id);}
      },
      edit:{
        text: 'Edit',
        src: icons.edit(),
        fun: (id) => {alert('Edit. Cooming soon');}
      },
      pending:{
        text: 'Pending',
        src: icons.pending(),
        fun: (id) => {this.listMethods.setAsPending(id);}
      },
      remove:{
        text: 'Remove',
        src: icons.delete(),
        fun: (id) => {this.listMethods.removeItem(id);}
      }
    };
  }
};
