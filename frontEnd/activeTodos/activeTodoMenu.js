/*jshint esversion: 6 */
const ContextMenu = require('./../menus/menu');
const icons = require('./../icons/icons.js');
const OPTIONS = require('./../optionHandler/OptionHandler');


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
        fun: (id) => {this.listMethods.openProgressEditor(id);}
      },
      notes:{
        text: 'Notes',
        src: icons.notes(),
        fun: (id) => {this.listMethods.openNoteEditor(id);}
      },
      edit:{
        text: 'Edit',
        src: icons.edit(),
        fun: (id) => {this.listMethods.editItem(id);}
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

    //If target todo is a score todo, we remove the progress btn.
    let todo = OPTIONS.activeTodos.getTaskByInstantId(id);
    if(todo.hours=='Score'){
      delete this.options.progress;
    }

  }
};
