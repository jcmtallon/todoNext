/*jshint esversion: 9 */
const DbHandler = require('./../DbHandler/DbHandler');
const MsgBox = require('./../messageBox/messageBox');

let _db;
let _stats;
let _userId;
let _messanger;

module.exports = class Stats{
  constructor(stats, userId){
    _stats = stats;
    _userId = userId;
    _db = new DbHandler();
    _messanger = new MsgBox();
  }

  getStats(){
    return _stats;
  }

  setStats(stats){
    _stats = stats;
  }

  get pendingTasks(){
    return _stats.pendingTasks;
  }

  get completedTasks(){
    return _stats.completedTasks;
  }


  /**
   * Adds the specified value to the
   * pendingTasks stat.
   * @param  {number} value
   */
  sumToPending(value){
    _stats.pendingTasks = _stats.pendingTasks + value;
  }

  /**
   * Adds the specified value to the
   * completedTasks stat.
   * @param  {number} value
   */
  sumToComplete(value){
    _stats.completedTasks = _stats.completedTasks + value;
  }
};
