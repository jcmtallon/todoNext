/*jshint esversion: 6 */

module.exports = class Category{
  constructor(){
    this._id = '';
    this._title = '';
    this._color = '';
    this._description = '';
    this._completedTaskNb = 0;
    this._totalTaskNb = 0;
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

  get color(){
    return this._color;
  }

  set color(value){
    this._color = value;
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


  /**
   * Compiles the properties into an object that can be understood
   * by the database structure.
   * @return {Object}
   */
  categoryToDbObject(){
    let dbObject = {
      title: this._title,
      color: this._color,
      id: this._id,
      description: this._description};

    return dbObject;
  }

};
