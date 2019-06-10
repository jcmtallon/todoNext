/*jshint esversion: 6 */

module.exports = class Task{
  constructor(dbTask){

    // Color assigned by default when no color is
    // selected by the user.
    this._id = (dbTask !== undefined) ? dbTask._id : undefined;
    this._title = (dbTask !== undefined) ? dbTask.title :'';
    this._dueTo = (dbTask !== undefined) ? dbTask.dueTo : undefined;
    this._urgency = (dbTask !== undefined) ? dbTask.urgency : '';
    this._hours = (dbTask !== undefined) ? dbTask.hours : 0;
    this._progress = (dbTask !== undefined) ? dbTask.progress : 0;
    this._isLearning = (dbTask !== undefined) ? dbTask.isLearning : false;
    this._status = (dbTask !== undefined) ? dbTask.status : '';
    this._categoryId = (dbTask !== undefined) ? dbTask.categoryId : '';
    this._projectId = (dbTask !== undefined) ? dbTask.projectId : '';
    this._habitId = (dbTask !== undefined) ? dbTask.habitId : '';
    this._notes = (dbTask !== undefined) ? dbTask.notes : '';
    this._userId = (dbTask !== undefined) ? dbTask.userId : '';
    this._instantId = (dbTask !== undefined) ? dbTask.instantId : '';
  }

  get id(){
    return this._id;
  }

  set id(value){
    this._id = value;
  }


  /**
   * To improve tool speed, we do not want to wait until receive
   * the id from the db when adding new tasks to the list.
   * Therefore we instantly create this alternative id directly
   * in the front end that we use for all the different task operations.
   * Once the task is mark as completed and saved in the complete task
   * collection, we discard this id.
   */
  get instantId(){
    return _instantId;
  }

  set instantId(value){
    this._instantId = value;
  }

  generateInstantId(){
    this._instantId = generateInstandId();
  }

  generateId(){
    this._id = getNewId();
  }

  get title(){
    return this._title;
  }

  set title(value){
    this._title = value;
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
  getAsListObject(){
    let listObject = {
      _id: this._id,
      title: this._title,
      dueTo: this._dueTo,
      urgency: this._urgency,
      hours : this._hours,
      progress : this._progress,
      isLearning : this._isLearning,
      status : this._status,
      categoryId : this._categoryId,
      projectId : this._projectId,
      habitId : this._habitId,
      notes : this._notes,
      instantId : this._instantId
      };
    return listObject;
  }

  getCompleteTask(){
    let dbObject = {
      _id: this._id,
      title: this._title,
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

  getPendingTask(){
    let dbObject = {
      _id: this._id,
      title: this._title,
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

function generateInstandId () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
}
