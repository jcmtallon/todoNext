const OPTIONS = require('./../optionHandler/OptionHandler');
const DbHandler = require('./../DbHandler/dbHandler');
const flashMsg = require('./../messageBox/flashMsg');
const moment = require('moment');


class PointFactory{
  constructor(){
    this.db = new DbHandler();
  }

  generatePointFromTask(task, height, score){
    if(task.hours=='1' && task.progress!=1) return this._generateSinglePoint(task, height);
    if(task.hours=='Score') return this._generateSinglePoint(task, height, score);
    return this._generateMultiplePoints(task, height);
  }


  manageDbPoints(newT, bupT, height = undefined){

    let range = {};

    if(newT.progress > bupT.progress){
      range.firstPoint = bupT.progress + 1;
      range.lastPoint = newT.progress + 1;
      this._generateMultiplePoints(newT, height, range);
    }else{
      range.firstPoint = newT.progress + 1;
      range.lastPoint = bupT.progress + 1;
      this._deletePoints(newT, height, range, height);
    }
  }

  deleteScorePoint(task, height = undefined){
    this._removePointByTaskId(task._id, task.progress, height);
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

  async _removePointByTaskId(id, points, height){
    this.db.removePoint({taskId : id});
    OPTIONS.stats.sumPoints(-Math.abs(points));
    flashMsg.showAlertMsg(`-${points} pts`, height);
  }


  async _generateMultiplePoints(task, height = undefined, range = undefined){

    const now = moment();
    let dbpoints = [];

    let firstPoint = (range==undefined) ? parseInt(task.progress) + 1 : range.firstPoint;
    let lastPoint = (range==undefined) ? parseInt(task.hours) + 1 : range.lastPoint;

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
    let points = 0;

    let firstPoint = range.firstPoint;
    let lastPoint = range.lastPoint;

    for (let i = firstPoint; i < lastPoint; i++) {
      let id = task.instantId + '_p' + i;
      this.db.removePoint({taskId : id});
      points++;
    }

    if (points > 0){
      OPTIONS.stats.sumPoints(-Math.abs(points));
      flashMsg.showAlertMsg(`-${points} pts`, height);
    }
  }
}

module.exports = new PointFactory();
