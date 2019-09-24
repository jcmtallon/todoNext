// const Task = require('./../activeTodos/Task');
const DbHandler = require('./../dbHandler/dbHandler');

 let _db;
 let _userId;

module.exports = class Tasks{
  constructor(userId){
    _userId = userId;
    _db = new DbHandler();
  }


  /**
   * Fetches the specified task data from the database
   * task collection.
   * @param  {Object} request {status: 'complete', categoryId:'34123ds'}
   * @return {Object}         E.g. {"error": false, "tasks": [],"totalCount": 2}
   */
  async getTasksByQuery(request){
      request.userId = _userId;
      return await _db.getTasks(request);
    }
};
