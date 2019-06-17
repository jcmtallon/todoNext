/*jshint esversion: 6 */
const ContextMenu = require('./../menus/menu');
const icons = require('./../icons/icons.js');
const OPTIONS = require('./../optionHandler/OptionHandler');


module.exports = class HabitTaskMenu extends ContextMenu{
  constructor(trigger, id, listMethods){
    super(trigger, id);
    // Provides the different category list methods that
    // will be attached to each button action.
    this.listMethods = listMethods;

    // Each object attribute represents a button
    this.options = {
      edit:{
        text: 'Edit',
        src: icons.edit(),
        fun: (id) => {this.listMethods.editItem(id);}
      },
      remove:{
        text: 'Remove',
        src: icons.delete(),
        fun: (id) => {this.listMethods.removeItem(id);}
      },
      stop:{
        text: 'Stop',
        src: icons.stop(),
        fun: (id) => {this.listMethods.stopHabit(id);}
      },
      activate:{
        text: 'Activate',
        src: icons.activate(),
        fun: (id) => {this.listMethods.activateHabit(id);}
      }
    };

    //If target task is a score task, we remove the progress btn.
    let task = OPTIONS.habits.getHabitById(id);
    if(task.isActive){
      delete this.options.activate;
    }else{
      delete this.options.stop;
    }

  }
};
