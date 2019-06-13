/*jshint esversion: 6 */

module.exports = class Project{
  constructor(dbProj){

    // Color assigned by default when no color is
    // selected by the user.
    this._id = (dbProj !== undefined) ? dbProj._id : undefined;
    this._title = (dbProj !== undefined) ? dbProj.title :'';
    this._catId = (dbProj !== undefined) ? dbProj.categoryId : '';
    this._deadline = (dbProj !== undefined) ? dbProj.deadline : '';
    this._isLearning = (dbProj !== undefined) ? dbProj.isLearning : false;
    this._description = (dbProj !== undefined) ? dbProj.description : '';
    this._completedTaskNb = (dbProj !== undefined) ? dbProj.completedTaskNb : 0;
    this._totalTaskNb = (dbProj !== undefined) ? dbProj.totalTaskNb : 0;
    this._userId = (dbProj !== undefined) ? dbProj.userId : undefined;
    this._completedBy = (dbProj !== undefined) ? dbProj.completedBy : undefined;
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

  get categoryId(){
    return this._catId;
  }

  set categoryId(value){
    this._catId = value;
  }

  get deadline(){
    return this._deadline;
  }

  set deadline(value){
    this._deadline = value;
  }

  get isLearning(){
    return this._isLearning;
  }

  set isLearning(value){
    this._isLearning = value;
  }

  get description(){
    return this._description;
  }

  set description(value){
    this._description = value;
  }

  get completedTaskNb(){
    return this._completedTaskNb;
  }

  set completedTaskNb(value){
    this._completedTaskNb = value;
  }

  get totalTaskNb(){
    return this._totalTaskNb;
  }

  set totalTaskNb(value){
    this._totalTaskNb = value;
  }

  get userId(){
    return this._userId;
  }

  set userId(value){
    this._userId = value;
  }

  get completedBy(){
    return this._completedBy;
  }

  set completedBy(value){
    this._completedBy = value;
  }


  /**
   * Compiles the properties into an object that can be understood
   * by the database structure.
   * @return {Object}
   */
  projectToDbObject(){
    let dbObject = {
      _id: this._id,
      title: this._title,
      categoryId: this._catId,
      deadline: this._deadline,
      isLearning: this._isLearning,
      description: this._description,
      completedTaskNb: this._completedTaskNb,
      totalTaskNb: this._totalTaskNb
      };
    return dbObject;
  }

  projectToCompleteProject(){
    let dbObject = {
      _id: this._id,
      title: this._title,
      categoryId: this._catId,
      deadline: this._deadline,
      isLearning: this._isLearning,
      description: this._description,
      completedTaskNb: this._completedTaskNb,
      totalTaskNb: this._totalTaskNb,
      userId: this._userId,
      completedBy: new Date()
      };

    return dbObject;
  }
};
