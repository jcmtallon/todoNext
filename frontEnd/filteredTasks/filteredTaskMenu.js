const ContextMenu = require('./../menus/menu');
const icons = require('./../icons/icons.js');


module.exports = class FilteredTaskMenu extends ContextMenu {
  constructor(trigger, id, listMethods, task, usesInstantId) {
    super(trigger, id, usesInstantId);
    // Provides the different category list methods that
    // will be attached to each button action.
    this.listMethods = listMethods;

    // Each object attribute represents a button
    this.options = {
      progress: {
        text: 'Progress',
        src: icons.progress(),
        fun: (id) => {
          this.listMethods.openProgressEditor(id);
        }
      },
      notes: {
        text: 'Notes',
        src: icons.notes(),
        fun: (id) => {
          this.listMethods.openNoteEditor(id);
        }
      },
      edit: {
        text: 'Edit',
        src: icons.edit(),
        fun: (id) => {
          this.listMethods.editItem(id);
        }
      },
      ongoing: {
        text: 'Started',
        src: icons.ongoing('#757575'),
        fun: (id) => {
          this.listMethods.toggleActiveStatus(id);
        }
      },
      notStarted: {
        text: 'Not started',
        src: icons.activate('#757575'),
        fun: (id) => {
          this.listMethods.toggleActiveStatus(id);
        }
      },
      pending: {
        text: 'Pending',
        src: icons.pending(),
        fun: (id) => {
          this.listMethods.setAsPending(id);
        }
      },
      activate: {
        text: 'Activate',
        src: icons.activate('#757575'),
        fun: (id) => {
          this.listMethods.setAsActive(id);
        }
      },
      complete: {
        text: 'Complete',
        src: icons.checkbox('#757575'),
        fun: (id) => {
          this.listMethods.setAsComplete(id);
        }
      },
      remove: {
        text: 'Remove',
        src: icons.delete(),
        fun: (id) => {
          this.listMethods.removeItem(id);
        }
      }
    };

    //If target task is a score task, we remove the progress btn.
    if (task.hours == 'Score') {
      delete this.options.progress;
    }

    //Show or hide buttons based on the task status value.
    switch (task.status) {
      case 'ongoing':
        delete this.options.ongoing;
        delete this.options.activate;
        break;

      case 'pending':
        delete this.options.edit;
        delete this.options.notes;
        delete this.options.progress;
        delete this.options.pending;
        delete this.options.ongoing;
        delete this.options.notStarted;
        delete this.options.complete;
        delete this.options.remove;
        break;

      case 'complete':
        delete this.options.edit;
        delete this.options.notes;
        delete this.options.progress;
        delete this.options.pending;
        delete this.options.ongoing;
        delete this.options.notStarted;
        delete this.options.complete;
        delete this.options.remove;
        break;

      default:
        delete this.options.notStarted;
        delete this.options.activate;
    }
  }
};
