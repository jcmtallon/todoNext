/*jshint esversion: 6 */

module.exports = class Todo{
  constructor(dbTodo){

    // Color assigned by default when no color is
    // selected by the user.
    this._id = (dbTodo !== undefined) ? dbTodo._id : undefined;
    this._title = (dbTodo !== undefined) ? dbTodo.title :'';
    this._isHabit = (dbTodo !== undefined) ? dbTodo.isHabit : false;
    this._dueTo = (dbTodo !== undefined) ? dbTodo.dueTo : undefined;
    this._urgency = (dbTodo !== undefined) ? dbTodo.urgency : '';
    this._hours = (dbTodo !== undefined) ? dbTodo.hours : 0;
    this._progress = (dbTodo !== undefined) ? dbTodo.progress : 0;
    this._isLearning = (dbTodo !== undefined) ? dbTodo.isLearning : false;
    this._status = (dbTodo !== undefined) ? dbTodo.status : '';
    this._categoryId = (dbTodo !== undefined) ? dbTodo.categoryId : '';
    this._projectId = (dbTodo !== undefined) ? dbTodo.projectId : '';
    this._habitId = (dbTodo !== undefined) ? dbTodo.habitId : '';
    this._notes = (dbTodo !== undefined) ? dbTodo.notes : '';
    this._userId = (dbTodo !== undefined) ? dbTodo.userId : '';
  }

  get id(){
    return this._id;
  }

  set id(value){
    this._id = value;
  }

  get title(){
    return this._title;
  }

  set title(value){
    this._title = value;
  }

  get isHabit(){
    return this._isHabit;
  }

  set isHabit(value){
    this._isHabit = value;
  }

  get dueTo(){
    return this._dueTo;
  }

  set dueTo(value){
    this._dueTo = value;
  }

  get urgency(){
    return this._urgency;
  }

  set urgency(value){
    this._urgency = value;
  }

  get hours(){
    return this._hours;
  }

  set hours(value){
    this._hours = value;
  }

  get progress(){
    return this._progress;
  }

  set progress(value){
    this._progress = value;
  }

  get isLearning(){
    return this._isLearning;
  }

  set isLearning(value){
    this._isLearning = value;
  }

  get status(){
    return this._status;
  }

  set status(value){
    this._status = value;
  }

  get categoryId(){
    return this._categoryId;
  }

  set categoryId(value){
    this._categoryId = value;
  }

  get projectId(){
    return this._projectId;
  }

  set projectId(value){
    this._projectId = value;
  }

  get habitId(){
    return this._habitId;
  }

  set habitId(value){
    this._habitId = value;
  }

  get notes(){
    return this._notes;
  }

  set notes(value){
    this._notes = value;
  }

  get userId(){
    return this._userId;
  }

  set userId(value){
    this._userId = value;
  }



  /**
   * Compiles the properties into an object that can be understood
   * by the database structure.
   * @return {Object}
   */
  todoToDbObject(){
    let dbObject = {
      _id: this._id,
      title: this._title,
      isHabit: this._isHabit,
      dueTo: this._dueTo,
      urgency: this._urgency,
      hours : this._hours,
      progress : this._progress,
      isLearning : this._isLearning,
      status : this._status,
      categoryId : this._categoryId,
      projectId : this._projectId,
      habitId : this._habitId,
      notes : this._notes
      };
    return dbObject;
  }

  getCompleteTodo(){
    let dbObject = {
      _id: this._id,
      title: this._title,
      isHabit: this._isHabit,
      dueTo: this._dueTo,
      urgency: this._urgency,
      hours : this._hours,
      progress : this._progress,
      isLearning : this._isLearning,
      status : "complete",
      categoryId : this._categoryId,
      projectId : this._projectId,
      habitId : this._habitId,
      notes : this._notes,
      userId : this._userId
      };

    return dbObject;
  }

  getPendingTodo(){
    let dbObject = {
      _id: this._id,
      title: this._title,
      isHabit: this._isHabit,
      dueTo: this._dueTo,
      urgency: this._urgency,
      hours : this._hours,
      progress : this._progress,
      isLearning : this._isLearning,
      status : "pending",
      categoryId : this._categoryId,
      projectId : this._projectId,
      habitId : this._habitId,
      notes : this._notes,
      userId : this._userId
      };

    return dbObject;
  }
};
