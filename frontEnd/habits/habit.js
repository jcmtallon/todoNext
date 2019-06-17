/*jshint esversion: 9 */

module.exports = class Habit{
  constructor(dbHabit){


    this._id = (dbHabit !== undefined) ? dbHabit._id : undefined;
    this._title = (dbHabit !== undefined) ? dbHabit.title : undefined;
    this._description = (dbHabit !== undefined) ? dbHabit.description : undefined;
    this._categoryId = (dbHabit !== undefined) ? dbHabit.categoryId : undefined;
    this._frequency = (dbHabit !== undefined) ? dbHabit.frequency : undefined;
    this._hours = (dbHabit !== undefined) ? dbHabit.hours : undefined;
    this._nextTaskDate = (dbHabit !== undefined) ? dbHabit.nextTaskDate : undefined;
    this._urgency = (dbHabit !== undefined) ? dbHabit.urgency : undefined;
    this._isActive = (dbHabit !== undefined) ? dbHabit.isActive : undefined;
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

  get isActive(){
    return this._isActive;
  }

  set isActive(value){
    this._isActive = value;
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
      urgency: this._urgency,
      isActive: this._isActive,
      };
    return dbObject;
  }

};
