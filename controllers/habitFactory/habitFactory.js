/*jshint esversion: 6 */
const EventEmitter = require('events');


module.exports = class HabitFactory extends EventEmitter{
  constructor(db){
    super(db);

    this._db = db;

  }

  generateTasks(habits){

    // Create a today date with 0h0s.
    let today = new Date();
    let flatToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

    // Array with the habit tasks that need to be generated.
    let tasks = [];

    // Will decide if habit tasks must be generated.
    let generateTasks = false;

    for(let i=0;i<habits.length;i++){

      // If empty, it means that the habit was just created
      // and therefore it needs its first task.
      if(!habits[i].nextTaskDate){
        generateTasks=true;
        habits[i].nextTaskDate = flatToday;
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
        this._db.updateHabitNextTaskDate(habitId, habits[i].nextTaskDate);



      }
    }

    if(tasks.length>0){
      this._db.bulkAddTasks(tasks);
    }else{
      // If no new tasks to add, simply get the most recent active tasks from
      // the db and print the list.
      this.emit('printList');
    }

  }
};



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
