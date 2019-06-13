/*jshint esversion: 9 */

module.exports = class Habit{
  constructor(dbHabit){

    if(dbHabit!=undefined){
      const {_id, title, description, categoryId, frequency, hours, nextTaskDate, urgency} = dbHabit;
    }

    this._id = (dbHabit !== undefined) ? _id : undefined;
    this._title = (dbHabit !== undefined) ? title : undefined;
    this._description = (dbHabit !== undefined) ? description : undefined;
    this._categoryId = (dbHabit !== undefined) ? categoryId : undefined;
    this._frequency = (dbHabit !== undefined) ? frequency : undefined;
    this._hours = (dbHabit !== undefined) ? hours : undefined;
    this._nextTaskDate = (dbHabit !== undefined) ? nextTaskDate : undefined;
    this._urgency = (dbHabit !== undefined) ? urgency : undefined;
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

  get description(){
    return this._description;
  }

  set description(value){
    this._description = value;
  }

  get categoryId(){
    return this._categoryId;
  }

  set categoryId(value){
    this._categoryId = value;
  }

  get frequency(){
    return this._frequency;
  }

  set frequency(value){
    this._frequency = value;
  }

  get hours(){
    return this._hours;
  }

  set hours(value){
    this._hours = value;
  }

  get nextTaskDate(){
    return this._nextTaskDate;
  }

  set nextTaskDate(value){
    this._nextTaskDate = value;
  }

  get urgency(){
    return this._urgency;
  }

  set urgency(value){
    this._urgency = value;
  }

  /**
   * Compiles the properties into an object that can be understood
   * by the database structure.
   * @return {Object}
   */
  categoryToDbObject(){
    let dbObject = {
      _id: this._id,
      title: this._title,
      description: this._description,
      categoryId: this._categoryId,
      frequency: this._frequency,
      hours: this._hours,
      nextTaskDate: this._nextTaskDate,
      urgency: this._urgency
      };
    return dbObject;
  }

};
