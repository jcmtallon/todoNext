/*jshint esversion: 6 */
const WarWriter = require('./../controllers/warFile/warFileWriter');


module.exports = class Sandbox{
  constructor(){
  this._war = new WarWriter();
  }

  readWar(){
    this._war.addTodoToWarData();
  
  }

};
