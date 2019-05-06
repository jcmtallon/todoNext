/*jshint esversion: 6 */

module.exports = class Category{
  constructor(){

    // Color assigned by default when no color is
    // selected by the user.
    this._defaultColor = '#263e65';

    this._id = generateId();
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
    if (value != ''){
      this._color = value;
    }else{
      this._color = this._defaultColor;
    }
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
      description: this._description,
      completedTaskNb: this._completedTaskNb,
      totalTaskNb: this._totalTaskNb
      };

    return dbObject;
  }
};



/**
   * Creates a string that can be used for dynamic id attributes
   * Example: "id-so7567s1pcpojemi"
   * @returns {string}
   */
function generateId() {
  return 'id-' + Math.random().toString(36).substr(2, 16);
}
