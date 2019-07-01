/*jshint esversion: 9 */
const DbHandler = require('./../DbHandler/DbHandler');
const MsgBox = require('./../messageBox/messageBox');

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
