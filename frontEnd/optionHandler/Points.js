const DbHandler = require('./../DbHandler/DbHandler');
const MsgBox = require('./../messageBox/messageBox');
const moment = require('moment');

let _db;
let _userId;
let _messanger;

module.exports = class Points{
  constructor(userId){
    _userId = userId;
    _db = new DbHandler();
    _messanger = new MsgBox();
  }

  async getPoints(query){
    const data = await _db.getPoints({
      userId: _userId,
      from: moment(query.from).toDate(),
      until: moment(query.until).toDate()});
    return data;
  }
};
