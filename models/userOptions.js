/*jshint esversion: 6 */
const mongoose = require('mongoose');



/**
 */
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
      nextTaskDate: Date,
      urgency: String,
      description: String,
      isActive: Boolean
    }
  ],
  isFirstSession: Boolean,
  lastHabitUpdate: Date,
});
