/*jshint esversion: 6 */
const mongoose = require('mongoose');



/**
 * todoList: Used to remember the order set by the user for the main todo list.
 * categories: categories set by the user.
 *
 */
module.exports = mongoose.Schema({
  activeTodos:[
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
      notes: String
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
  isFirstSession: Boolean,
  lastHabitUpdate: Date,
});
