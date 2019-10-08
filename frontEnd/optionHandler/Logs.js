/*jshint esversion: 9 */
const DbHandler = require('./../dbHandler/dbHandler');
const MsgBox = require('./../messageBox/messageBox');
const moment = require('moment');

let _db;
let _logs;
let _userId;
let _messanger;

module.exports = class Logs{
  constructor(logs, userId){
    _logs = logs;
    _userId = userId;
    _db = new DbHandler();
    _messanger = new MsgBox();
  }

  getLogs(){
    return _logs;
  }

  setLogs(logs){
    _logs = logs;
  }

  getlastHabitUpdate(){
    return new Date(_logs.lastHabitUpdate);
  }

  getFixedPeriodsVal(){
    return _logs.fixedPeriods;
  }

  setFixedPeriodsVal(val){
    _logs.fixedPeriods = val;
  }


  /**
   * TODO: improve this horrible horrible solution.
   * The database native version control system was throwing errors when trying
   * to update the same document frequently in a short period of time.
   * As a solution, the native version control system was disabled.
   * Much time later, we found out that every now and then, for a reason still unkown,
   * the front end sends by mistake and old version of the user option object, replacing
   * newer versions making the user lose valuable information.
   * As a dirty solution to such problem, we always update this version parameter
   * before updating the database option object.
   * Then, the backend makes sure that never a newer version is overwriten with
   * and older version.  
   */
  incrementSaveVersion(){
    if(!_logs.hasOwnProperty('saveVersion')){
     _logs.saveVersion = 1;
    }else{
      _logs.saveVersion = _logs.saveVersion + 1;
    }
  }

  /**
   * Returns true if today's day does not match with the
   * date registered in the currentDay log option.
   * @return {Boolean}
   */
  isNewDay(){
    if(!moment(_logs.currentToday).isSame(moment(), 'day')){
      return true;
    }
  }

  /**
   * Returns true if today's week does not match with the
   * date registered in the currentDay log option.
   * @return {Boolean}
   */
  isNewWeek(){
    if(!moment(_logs.currentToday).isSame(moment(), 'week')){
      return true;
    }
  }

  /**
   * Returns true if today's month does not match with the
   * date registered in the currentDay log option.
   * @return {Boolean}
   */
  isNewMonth(){
    if(!moment(_logs.currentToday).isSame(moment(), 'month')){
      return true;
    }
  }


  /**
   * Updates log currentToday value with today's date.
   */
  updateCurrentDate(){
    _logs.currentToday = moment();
  }


  /**
   * Used every time the active task page is loeaded to know if
   * checking the habit objects and generating new habit tasks is
   * required or not.
   * @return {Boolean}
   */
  mustGenerateHabits(){

    let lastUpdate = new Date(_logs.lastHabitUpdate);

    if (lastUpdate==undefined){
      return true;
    }

    let today = new Date();
    today.setHours(0,0,0,0);

    if (lastUpdate < today){
      return true;
    }

    return false;
  }


  /**
   * Sets last habit update date
   * as today.
   */
  setLastHabitDateAsToday(){
    const date = new Date();
    _logs.lastHabitUpdate = date;
  }



};
