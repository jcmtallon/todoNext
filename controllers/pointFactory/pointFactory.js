/*jshint esversion: 6 */
const MsgBox = require('./../messageBox/messageBox');


module.exports = class PointFactory{
  constructor(db){

  this._db = db;
  this._messanger = new MsgBox();
  }


//Updated todo example:
  // category: ""
  // categoryId: ""
  // dueTo: "2019-01-12T06:12:33.000Z"
  // frequency: 0
  // habitId: ""
  // hours: "Fast task"
  // learning: false
  // name: "ki qye sda"
  // nextTaskDate: null
  // progress: 1
  // project: ""
  // projectId: ""
  // status: "done"
  // type: "task"
  // urgency: "Normal"
  // user: "tally"
  // __v: 0
  // _id: "5c3985514dd5781c80920943"


  /**
   * generatePoints - Receives a completed todo and the number of points
   * cleared since its last progress update. Then saves those points
   * into one Point item in the point collection of the database. Then it informs
   * the user through a notice message.
   *
   * @param  {Object} updatedTodo Todo received from the db.
   * @param  {Number} points      1,2,3,4...
   */
  generatePoints(updatedTodo, points){

    let today = new Date();
    let flatToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

    let pointDbItem = {
      points: points,
      taskId : updatedTodo._id,
      categoryId: updatedTodo.categoryId,
      projectId: updatedTodo.projectId,
      date: flatToday,
      user: 'Tally'
    };

    const promiseToUpdate = this._db.addPoint(pointDbItem);

    promiseToUpdate.done((point)=>{
      this.reportScore(point.points);

    }).fail((err)=>{
      this._messanger.showMsgBox('Failed to save point data\ninto database.','error','down');
      console.log(err);
    });

  }

  reportScore(points){

    let singularCase;
    let plurarCase;

    if(points>0){
      singularCase = `You got <span class="msg_highlight">${points}</span> point!`;
      plurarCase = `You got <span class="msg_highlight">${points}</span> points!`;

      let msg = (points>1) ? plurarCase : singularCase;
      this._messanger.showMsgBox(msg,'goal','down');

    }else{

      let positiveNumber = Math.abs(points);
      singularCase = `You lost <span class="msg_highlight">${positiveNumber}</span> point!`;
      plurarCase = `You lost <span class="msg_highlight">${positiveNumber}</span> points!`;

      let msg = (positiveNumber>1) ? plurarCase : singularCase;
      this._messanger.showMsgBox(msg,'goal','down');

    }

  }



  /**
   * savePointWithId - Generates a 1 point using the passed id as
   * the point taskId. Only returns an error msg if fails to save
   * the point.
   *
   * @param  {String} pointId  task id + p + point index
   * @param  {Object} todo    Todo received by the app.
   */
  savePointWithId(pointId, todo){

    let today = new Date();
    let flatToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

    let pointDbItem = {
      points: 1,
      taskId : pointId,
      categoryId: todo.categoryId,
      projectId: todo.projectId,
      date: flatToday,
      user: 'Tally'
    };

    const promiseToUpdate = this._db.addPoint(pointDbItem);

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

};
