/*jshint esversion: 9 */
const DbHandler = require('./../DbHandler/dbHandler');
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
