const icons = require('./../icons/icons.js');

module.exports = [
  {
    icon: icons.activeTasks('#c6c6c6'),
    title: 'New',
    id: '',
  },
  {
    icon: icons.ongoing('#c6c6c6'),
    title: 'Ongoing',
    id: 'ongoing',
  },
  {
    icon: icons.pending('#c6c6c6'),
    title: 'Pending',
    id: 'pending',
  },
  {
    icon: icons.checkbox('#c6c6c6'),
    title: 'Complete',
    id: 'complete',
  }
];
