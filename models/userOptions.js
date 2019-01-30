/*jshint esversion: 6 */
const mongoose = require('mongoose');



/**
 * todoList: Used to remember the order set by the user for the main todo list.
 * categories: categories set by the user.
 *
 */
module.exports = mongoose.Schema({
  todoList:[
    {
      date: Date,
      todos: [
        {
          id: String,
          index: Number,
          name: String
        }
      ]
    }
  ],
  categories:[
    {
      title: String,
      id: String,
      color: String
    }
  ],
  projects:[
    {
      title: String,
      id: String,
      categoryId: String,
      status: String
    }
  ],
  isFirstSession: Boolean
});
