/*jshint esversion: 9 */
const OPTIONS = require('./../optionHandler/OptionHandler');
const Habit = require('./../habits/habit');
const Task = require('./../activeTodos/Task');
const moment = require('moment');




module.exports = class HabitTaskFactory{
  constructor(){
  }

  generateHabitTasks(){
    let habits = OPTIONS.habits.getHabits();
    $.each(habits,(index, habit) =>{
      if(mustGenerateTasks(habit)){
        generateTasks(habit);
      }
    });
  }


};


/**
 * Returns true when habit status
 * is active and the habit lastTaskDate date value is
 * smaller than the beginning of today.
 *
 * @param  {Object} dbHabit habit object
 * @return {Boolean}
 */
function mustGenerateTasks(dbHabit) {

    if (!dbHabit.isActive){return;}

    let today = new Date(); today.setHours(0,0,0,0);
    let lastTaskDate = new Date(dbHabit.lastTaskDate);

    if (lastTaskDate < today){
      return true;
    }
}



/**
 * Calculates and generates tasks for the number of
 * periods passed since the last update.
 */
function generateTasks(dbHabit) {

  let nbOfTasks = calculateNbOfTasksToGenerate(dbHabit);

  for(let j=1; j<=nbOfTasks; j++){
    addHabitTaskToActiveTasks(dbHabit, j);
  }

  // Update habit lastTaskDate
  dbHabit.lastTaskDate = generateLastTaskDate(dbHabit, nbOfTasks);

  // Update options
  let habit = new Habit(dbHabit);
  OPTIONS.habits.updateHabit(habit);
}



/**
 * Calculates the number of days between today and the habit
 * last task date, and returns the number of periods that can
 *  be extracted from such number.
 */
function calculateNbOfTasksToGenerate(dbHabit) {

  let today = new Date(); today.setHours(23,59,59,59);
  let lastTaskDate = new Date(dbHabit.lastTaskDate);
  let daysPassed = getDifferecenInDays(lastTaskDate, today);

  // If the result is 0 days, we add 1 to avoid errors in the following
  // methods.
  daysPassed = (daysPassed==0)? daysPassed+1 : daysPassed;
  let nbOfTasks = Math.ceil(daysPassed/dbHabit.frequency);
  return nbOfTasks;
}

/**
 * Returns the number of days between to dates.
 */
function getDifferecenInDays(date1, date2){
  let res = Math.abs(date1 - date2) / 1000;
  let difference = Math.floor(res / 86400);
  return difference;
}



/**
 * Calculates dueDate, generates task and
 * adds it to option active task array.
 */
function addHabitTaskToActiveTasks(dbHabit, periodNb) {

  let task = new Task();
  task.title = dbHabit.title;
  task.dueTo = calculateDueDate(dbHabit.lastTaskDate, dbHabit.frequency, periodNb);
  task.urgency = dbHabit.urgency;
  task.hours = (dbHabit.hours=='Fast task') ? 1 : dbHabit.hours;
  task.isLearning = false;
  task.categoryId = dbHabit.categoryId;
  task.projectId = ""; //habits cannot have projects. 
  task.habitId = dbHabit._id;
  task.progress = 0;

  OPTIONS.categories.addToCounters([task]);
  OPTIONS.activeTasks.addToActiveTasks([task]);
}



/**
 * Calculates due to adding the number of days multiplied
 * by the number of periods to the lastTaskDate value.
 */
function calculateDueDate(lastTaskDate, frequency, periodNb) {
  let lastTime = new moment(lastTaskDate);
  let dueTo = lastTime.add(frequency * periodNb, 'days');
  return dueTo.toDate(); //Transform to date object cause the swipe method cannot
                         // read moments yet.
}


/**
 * Calculates new lastTaskDate  adding the number of days multiplied
 * by the number of periods to the previous lastTaskDate value.
 */
function generateLastTaskDate(dbHabit, nbOfTasks) {

  let prevDate = new moment(dbHabit.lastTaskDate);
  let newDate = prevDate.add(dbHabit.frequency * nbOfTasks, 'days');
  return newDate;
}
