
const mongoose = require('mongoose');

// To reduce as much as possible to times in which the user has to fetch data from the back end
// when executing common operations like adding and updating todos, as soon as the user logs in,
// the front end receives a so called "user options" object with all the active todos, categories,
// active projects, habits and some basic stats and user settings.
// A large number of the user oprations in the front end directly manipulate this object, sending a copy
// of its newer version each time to the backend to keep it synced. Thanks to the fact that these operations
// don't require a response from the server, views are updated almost instantly and it is only in very special
// cases that the user experiences waiting times to complete their operations (like when opening the stats panel or
// when reviewing completed projects and tasks).  
module.exports = mongoose.Schema({
  activeTasks:[
    {
      title: String,
      dueTo: Date,
      urgency: String,
      hours: String,
      progress: Number,
      isLearning: Boolean,
      status: String,
      categoryId: String,
      projectId: String,
      habitId: String,
      notes: String,
      instantId: String
    }
  ],
  categories:[
    {
      title: String,
      color: String,
      description: String,
      completedTaskNb: Number,
      totalTaskNb: Number
    }
  ],
  projects:[
    {
      title: String,
      categoryId: String,
      deadline: Date,
      description: String,
      isLearning: Boolean,
      completedTaskNb: Number,
      totalTaskNb: Number,
    }
  ],
  habits:[
    {
      title: String,
      categoryId: String,
      frequency: Number,
      hours: String,
      lastTaskDate: Date,
      urgency: String,
      description: String,
      isActive: Boolean
    }
  ],
  logs: {
    isFirstSession: Boolean,
    lastHabitUpdate: Date,
    currentToday: Date,
    fixedPeriods: Boolean,
    saveVersion: Number
  },
  stats: {
    completedTasks: Number,
    pendingTasks: Number,
    comTaskDay: Number,
    comTaskWeek: Number,
    comTaskMonth: Number,
    comTaskBestDay: Number,
    comTaskBestWeek: Number,
    comTaskBestMonth: Number,
    comPointDay: Number,
    comPointWeek: Number,
    comPointMonth: Number,
    comPointBestDay: Number,
    comPointBestWeek: Number,
    comPointBestMonth: Number
  }
});
