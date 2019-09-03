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

  get comTaskToday(){
    return _stats.comTaskDay;
  }

  get comTaskWeek(){
    return _stats.comTaskWeek;
  }
  get comTaskMonth(){
    return _stats.comTaskMonth;
  }
  get comTaskBestDay(){
    return _stats.comTaskBestDay;
  }
  get comTaskBestWeek(){
    return _stats.comTaskBestWeek;
  }
  get comTaskBestMonth(){
    return _stats.comTaskBestMonth;
  }

  get comPointToday(){
    return _stats.comPointDay;
  }

  get comPointWeek(){
    return _stats.comPointWeek;
  }
  get comPointMonth(){
    return _stats.comPointMonth;
  }
  get comPointBestDay(){
    return _stats.comPointBestDay;
  }
  get comPointBestWeek(){
    return _stats.comPointBestWeek;
  }
  get comPointBestMonth(){
    return _stats.comPointBestMonth;
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
   * Rests the specified value from the
   * pendingTasks stat.
   * @param  {number} value
   */
  restToPending(value){
    _stats.pendingTasks = _stats.pendingTasks - value;
  }

  /**
   * Adds the specified value to the
   * completedTasks stat.
   * @param  {number} value
   */
  sumToComplete(value){
    _stats.completedTasks = _stats.completedTasks + value;
  }

  /**
   * Rests the specified value from the
   * completedTasks stat.
   * @param  {number} value
   */
  restToComplete(value){
    _stats.completedTasks = _stats.completedTasks - value;
  }

  /**
   * Adds the specified value to completed task counters
   * @param  {number} value
   */
  sumCompletedTask(value){

    _stats.comTaskDay = _stats.comTaskDay + value;
    _stats.comTaskWeek = _stats.comTaskWeek + value;
    _stats.comTaskMonth = _stats.comTaskMonth + value;
  }


  /**
   * Replaces current day record with new record (if there is)
   * and resets day counter.
   */
  updateDayRecords(){
    if(_stats.comTaskDay > _stats.comTaskBestDay){_stats.comTaskBestDay = _stats.comTaskDay;}
    _stats.comTaskDay = 0;
  }

  /**
   * Replaces current week record with new record (if there is)
   * and resets week counter.
   */
  updateWeekRecords(){
    if(_stats.comTaskWeek > _stats.comTaskBestWeek){_stats.comTaskBestWeek = _stats.comTaskWeek;}
    _stats.comTaskWeek = 0;
  }

  /**
   * Replaces current month record with new record (if there is)
   * and resets month counter.
   */
  updateMonthRecords(){
    if(_stats.comTaskMonth > _stats.comTaskBestMonth){_stats.comTaskBestMonth = _stats.comTaskMonth;}
    _stats.comTaskMonth = 0;
  }
};
