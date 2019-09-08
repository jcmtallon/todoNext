const OPTIONS = require('./../optionHandler/OptionHandler');
const DbHandler = require('./../DbHandler/DbHandler');
const flashMsg = require('./../messageBox/flashMsg');
const moment = require('moment');


class PointFactory{
  constructor(){
    this.db = new DbHandler();
  }

  generatePointFromTask(task, height, score){
    if(task.hours=='1') return this._generateSinglePoint(task, height);
    if(task.hours=='Score') return this._generateSinglePoint(task, height, score);
    return this._generateMultiplePoints(task, height);
  }


  manageDbPoints(newT, bupT){

    let range = {};

    if(newT.progress > bupT.progress){
      range.firstPoint = bupT.progress + 1;
      range.lastPoint = newT.progress + 1;
      this._generateMultiplePoints(newT, undefined, range);
    }else{
      range.firstPoint = newT.progress + 1;
      range.lastPoint = bupT.progress + 1;
      this._deletePoints(newT, undefined, range);
    }
  }



  //----------------------- Private -------------------------------------------//

  async _generateSinglePoint(task, height, score= undefined){

    let now = moment();
    let points = (score==undefined) ? parseInt(task.hours) : score;

    let point = {
      points: points,
      taskId : task._id,
      categoryId: task.categoryId,
      projectId: task.projectId,
      habitId: task.habitId,
      date: now,
      user: OPTIONS.userId
    };

    OPTIONS.stats.sumPoints(points);
    flashMsg.showPlainMsg(`+${points} pts`, height);

    return this.db.addPoints([point]);
  }


  async _generateMultiplePoints(task, height = undefined, range = undefined){

    const now = moment();
    let dbpoints = [];

    let firstPoint = (range==undefined) ? parseInt(task.progress) + 1 : range.firstPoint;
    let lastPoint = (range==undefined) ? parseInt(task.hours) + 1 : range.firstPoint;

    for (let i = firstPoint; i < lastPoint; i++) {
      dbpoints.push({
        points: 1,
        taskId : task.instantId + '_p' + i,
        categoryId: task.categoryId,
        projectId: task.projectId,
        habitId: task.habitId,
        date: now,
        user: OPTIONS.userId
      });
    }

    const points = dbpoints.length;

    if (points > 0){
      OPTIONS.stats.sumPoints(points);
      flashMsg.showPlainMsg(`+${points} pts`, height);
      return this.db.addPoints(dbpoints);
    }
  }

  async _deletePoints(task, height = undefined, range = {}){

    const now = moment();
    let dbpoints = [];
    let points;

    let firstPoint = range.firstPoint;
    let lastPoint = range.firstPoint;

    for (let i = firstPoint; i < lastPoint; i++) {
      let id = task.instantId + '_p' + i;
      this.db.removePoint({taskId : id});
      points ++;
    }


    if (points > 0){
      OPTIONS.stats.sumPoints(-Math.abs(points));
      flashMsg.showAlertMsg(`-${points} pts`, height);
    }
  }







  /**
   * savePointWithId - Generates a 1 point using the passed id as
   * the point taskId. Only returns an error msg if fails to save
   * the point.
   *
   * @param  {String} pointId  task id + p + point index
   * @param  {Object} task    Task received by the app.
   */
  savePointWithId(pointId, task){

    let today = new Date();
    let flatToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

    let pointDbItem = {
      points: 1,
      taskId : pointId,
      categoryId: task.categoryId,
      projectId: task.projectId,
      date: flatToday,
      user: OPTIONS.userId
    };

    const promiseToUpdate = this._db.addPoints([pointDbItem]);

    promiseToUpdate.done((point)=>{}).fail((err)=>{
      this._messanger.showMsgBox('Failed to save point data\ninto database.','error','down');
      console.log(err);
    });

  }


  /**
   * removePointWithId - Removes indicated point from the db.
   *
   * @param  {String} pointId task id + p + point index
   */
  removePointWithId(pointId){

    let pointDbItem = {taskId : pointId};

    const promiseToUpdate = this._db.removePoint(pointDbItem);

    promiseToUpdate.done((point)=>{}).fail((err)=>{
      this._messanger.showMsgBox('Failed to remove point\nfrom database.','error','down');
      console.log(err);
    });
  }

}

module.exports = new PointFactory();
