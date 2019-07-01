/*jshint esversion: 9 */
const EventEmitter = require('events');
const Habit = require('./../habits/habit');
const DbHandler = require('./../DbHandler/DbHandler');
const MsgBox = require('./../messageBox/messageBox');

 let _db;
 let _userId;
 let _habits;
 let _messanger;

module.exports = class Habits extends EventEmitter{
  constructor(habits, userId){
    super();
    _habits = habits;
    _userId = userId;
    _db = new DbHandler();
    _messanger = new MsgBox();
  }


  /**
   * Returns array with all saved habits
   * db objects.
   */
  getHabits(){
    return _habits;
  }

  /**
   * Get number of elements in the array.
   */
  getNbOfItems(){
    return _habits.length;
  }


  setHabits(habits){
    _habits = habits;
  }


  /**
   * Returns habit object for specified habit.
   */
  getHabitById(id){
    let dbHabit = _habits.find (obj => {return obj._id == id;});
    if (dbHabit != undefined){
      let habit =  new Habit(dbHabit);
      return habit;
    }
  }


  /**
   * Receives a habit object and the
   * callback to perform as soon as the
   * category has been correctly saved to
   * the database. Returns the callback.
   */
  addHabit(habit, callback){
    let dbHabit = habit.habitToDbObject();
    _habits.push(dbHabit);
    updateDatabase(callback);
  }


  /**
   * Finds habit by the specified id and
   * changes its status to false.
   */
  stopById(id){
    _habits = _habits.map((hab) => {
      if(hab._id == id){
        hab.isActive = false;
      }
      return hab;
    });
  }


  /**
   * Sets all habit isActive attributes to true.
   */
  activateById(id){
    _habits = _habits.map((hab) => {
      if(hab._id == id){
        hab.isActive = true;
      }
      return hab;
    });
  }


  /**
   * Sets all habit isActive attribute to true.
   */
  activateAll(){
    _habits = _habits.map((hab) => {
      hab.isActive = true;
      return hab;
    });
  }


  /**
   * Sets all habit isActive attribute to false.
   */
  deactivateAll(){
    _habits = _habits.map((hab) => {
      hab.isActive = false;
      return hab;
    });
  }

  /**
   * Transform habit object into db habit object,
   * pushes the habit into the database and returns
   * the new db object that includes the new id inside.
   */
  async promiseToAddHabit(habit){
    const dbHabit = habit.categoryToDbObject();
    const updatedUser = await addHabitToDb(dbHabit);
    _habits = updatedUser.options.habits;
    this.emit('updateScreen');
    return _habits[_habits.length-1];
  }



  /**
   * Updates an existing habit with the new
   * habit object received, updates the database
   * and exectures the callback.
   */
  updateHabit(habit){
    _habits = _habits.map((hab) => {
      if(hab._id == habit.id){
        hab.title = habit.title;
        hab.description = habit.description;
        hab.categoryId = habit.categoryId;
        hab.frequency = habit.frequency;
        hab.hours = habit.hours;
        hab.lastTaskDate = habit.lastTaskDate;
        hab.urgency = habit.urgency;
      }
      return hab;
    });
    this.emit('updateScreen');
  }


  /**
   * Updates both local and db habit array with
   * received habits.
   */
  saveHabits(habits){
    _habits = habits;
    updateDatabase();
  }


  /**
   * Removes one id from the categorry array
   * object and updates the database.
   */
  async removeHabitById(id, callback, errorHandler){
    try{
      let userData = await removeHabitFromId(id);
      let index = _habits.map(x => {
        return x._id;
      }).indexOf(id);
      _habits.splice(index, 1);
      this.emit('updateScreen');
      if (callback!=undefined){callback();}


    } catch (err){
      if (errorHandler!=undefined){errorHandler();}
      _messanger.showMsgBox('An error occurred when removing the habit data.Please refresh the page and try again.','error','down');
      console.log(err);
    }
  }


  /**
   * Updates the database habit array with the local habit array info.
   */
  updateDb(){
    this.emit('updateScreen');
    return _db.updateOptions(_userId, {habits: _habits});
    }
};


/**
 * Patches data into database and executes callback
 * when there is one.
 */
function updateDatabase(callback, errorHandler){
  const saveHabits = _db.updateOptions(_userId, {habits: _habits});

  saveHabits.done((dbHabs) => {
    _habits = dbHabs.options.habits;
    if (callback != undefined){
      callback();
    }

  }).fail((err) => {
    _messanger.showMsgBox('An error occurred when saving the category data.\nPlease refresh the page and try again.','error','down');
    console.log(err);
    if (errorHandler != undefined){
      callback();
    }
  });
}


/**
 * Pushes new db habit into db habit array.
 * Returns a promise with all the user option data.
 */
async function addHabitToDb(habit) {
  return _db.addHabit(_userId, habit);
}


/**
 * Removes the specified task from the array of active tasks in the
 * db option object.
 */
async function removeHabitFromId(id) {
  return _db.removeHabit(_userId, id);
}
