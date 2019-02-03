/*jshint esversion: 6 */
const EventEmitter = require('events');

let db;

module.exports = class HabitFactory extends EventEmitter{
  constructor(dbHandler){
    super(dbHandler);

    db = dbHandler;

  }


  /**
   * generateTasks - Loops habit array and creates 1 or multiple tasks, depending on
   * the number of days passed since the last task was created, for each habit (when necessary).
   *
   * @param  {type} habits  Array of habit objects.
   * @return {Array}        Array of todo objects.
   */
  generateTasks(habits){

    // Create a today date with 0h0s.
    let today = new Date();
    let flatToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

    // Array with the habit tasks that need to be generated.
    let tasks = [];

    // Will decide if habit tasks must be generated.
    let generateTasks;

    for(let i=0;i<habits.length;i++){

      generateTasks=false;

      // If empty, it means that the habit was just created
      // and therefore it needs its first task.
      // As nextTaskDate, we add yesterday's date so
      if(!habits[i].nextTaskDate){
        generateTasks=true;
        habits[i].nextTaskDate = new Date(flatToday.getFullYear(), flatToday.getMonth(), flatToday.getDate() - 1, 0, 0, 0);
      }else{

        habits[i].nextTaskDate = new Date(habits[i].nextTaskDate);
        // If the deadline for finishing the previous task has been exceeded,
        // we can create the following task.
        if(flatToday.getTime() > habits[i].nextTaskDate.getTime()){
          generateTasks=true;
        }
      }

      if(generateTasks){


        // We copy the habit id into the habitId property so the tasks
        // that get greated from this habit have a reference id to the habit.
        // We also kill the id property to prevent from getting a duplicate key
        // error when saving the tasks in the db.
        let habitId = habits[i]._id;
        delete habits[i]._id;
        habits[i].habitId = habitId;

        // Type is changed into 'task' so the created tasks are considered
        // like tasks by the system.
        habits[i].type = 'task';


        // We find out the number of days passed since the last deadline
        // until today.
        let daysPassed = differenceOfDays(habits[i].nextTaskDate, flatToday);

        // If the result is 0 days, we add 1 to avoid errors in the following
        // methods.
        daysPassed = (daysPassed==0)? daysPassed+1:daysPassed;

        // We calculate the number of tasks to create based on the number
        // of days passed.
        let periods = Math.ceil(daysPassed/habits[i].frequency);


        // For each period, we update the deadline and save it into
        // the tasks array.
        for(let j=1; j<=periods; j++){
          habits[i].dueTo = new Date(habits[i].nextTaskDate.getFullYear(), habits[i].nextTaskDate.getMonth(), habits[i].nextTaskDate.getDate() + habits[i].frequency, 0, 0, 0);
          habits[i].nextTaskDate = new Date(habits[i].dueTo.getFullYear(), habits[i].dueTo.getMonth(), habits[i].dueTo.getDate(), 0, 0, 0);
          tasks.push(cloneHabit(habits[i]));
        }

        // We request the db to update the habit with
        // the latest deadline.
        updateDatabaseHabit(habitId, habits[i].nextTaskDate);

      }
    }

    return tasks;

  }
};


/**
 * updateDatabaseHabit - Compiles request into an object that moongose
 * can understand, applies a 4000 delay and then requests the update
 * to the dbhandler.
 * To avoid that these post requests get ahead of other more important posts
 * (something that could slow down the process), I give some delay to this
 * method so this post is sent after the ui has been printed and the end user
 * won't perceive the delay.
 *
 * @param  {String} id       target todo id.
 * @param  {Date} nextDate
 */
function updateDatabaseHabit(id, nextDate){

  const request = {nextTaskDate: nextDate};

  setTimeout( () => {
    const promiseToUpdateHabit = db.updateTodoById(id,request);

    promiseToUpdateHabit.done((data)=>{}).fail((err)=>{
      console.log(`Error when updating habit ${id} on db.`);
      });
  }, 4000);



}

/**
 * differenceOfDays - Returns the number of days between to dates
 *
 * @param  {date} date1
 * @param  {date} date2
 * @return {number}
 */
function differenceOfDays(date1,date2){

  let res = Math.abs(date1 - date2) / 1000;
  let difference = Math.floor(res / 86400);

  return difference;
}



/**
 * cloneHabit - Returns a clone of the object passed.
 *
 * @param  {object} habit
 * @return {object}
 */
function cloneHabit(habit){

  let newHabit = JSON.parse(JSON.stringify(habit));
  return newHabit;

}
