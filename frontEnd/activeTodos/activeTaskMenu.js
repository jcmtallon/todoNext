/*jshint esversion: 6 */
const ContextMenu = require('./../menus/menu');
const icons = require('./../icons/icons.js');
const OPTIONS = require('./../optionHandler/OptionHandler');


module.exports = class ActiveTaskMenu extends ContextMenu{
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
      ongoing:{
        text: 'Ongoing',
        src: icons.ongoing('#757575'),
        fun: (id) => {this.listMethods.toggleActiveStatus(id);}
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

    //If target task is a score task, we remove the progress btn.
    let task = OPTIONS.activeTasks.getTaskByInstantId(id);
    if(task.hours=='Score'){
      delete this.options.progress;
    }

  }
};
