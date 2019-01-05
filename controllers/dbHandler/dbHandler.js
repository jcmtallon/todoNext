/*jshint esversion: 6 */
const EventEmitter = require('events');
const MsgBox = require('./../messageBox/messageBox');


/**
 *
 */
module.exports = class DbHandler extends EventEmitter{
  constructor(){
    super();

    this._messanger = new MsgBox();

  }



  /**
   * addTask - Receives newTask order, parses the order data into an
   * object tan can be understood by the db, and sends this object to
   * the db. Once the response is back. It emits the received object.
   *
   * @param  {object} newTask object with all the new todo properties.
   * @return {emit}         Emits a message to the list controller class.
   */
  addTask(newTask){

    const delivery = {type: newTask.type,
                      name: newTask.name,
                      dueTo: newTask.dueTo,
                      frequency: newTask.frequency,
                      category: newTask.category,
                      project:newTask.project,
                      hours: newTask.hours,
                      urgency:newTask.urgency,
                      learning:newTask.learning,
                      status:newTask.status,
                      user:newTask.user,
                      categoryId:newTask.categoryId,
                      projectId:newTask.projectId,
                      progress: newTask.progress};

    $.ajax({
      type: 'POST',
      url: '/addTodo',
      data: delivery,
      success: (data) =>{
        this.emit('todoSaved',data);
      },
      error:(res) =>{this._messanger.showMsgBox('Failed to add item to database.\nPlease refresh the page and try again.','error','down');}
    });

  }


  /**
   * getActiveTodos - Receives a request for a type of item for a specific user.
   *
   * @param  {JSON} request ej:{user:'tally', status:'active'}
   * @return {emit}         emits a message to the list controller.
   */
  getActiveTodos(request){
    const promisedData = promiseData(request);
    promisedData.done((data)=>{
      this.emit('todosRetrieved',data);
    });
    //If error returns an empty array.
  }


  /**PENDING
   * removeTask - description
   *
   * @param  {type} id id of the todo to remove from the list and db.
   * @return {emit}    emits a message to the controller that includes the id
   * of the removed item.
   */
  removeTask(id){

    let targetTodo = {id: id};

    $.ajax({
      type: 'POST',
      url: '/removeTodo',
      data: targetTodo,
      success: (data) =>{this.emit('todoRemoved',data._id);},
      error: (res) =>{
        this._messanger.showMsgBox('Failed to remove item from database.\nPlease refresh the page and try again.','error','down');
        console.log(res);}
    });
  }




/**
 * updateDate - Updates todo Date in db
 *
 * @param  {string} currentId id of todo to modify
 * @param  {date} newDate   dueto date to save
 * @return {emits}           emits a msg back to the list controller with the
 * data of the updated Todo. 
 */
updateDate(currentId, newDate){

    let delivery = {id: currentId,
                    dueTo: newDate};

    $.ajax({
      type: 'POST',
      url: '/updateDate',
      data: delivery,
      success: (updatedTodo) =>{this.emit('dateSaved',updatedTodo);},
      error: (res) =>{
        this._messanger.showMsgBox('Failed to update date in database.\nPlease refresh the page and try again.','error','down');
        console.log(res);}
    });

  }

};



/**
 * promiseData - Ajax method used by several of the methods in this class.
 * It was sepparated to its own function so it can be transformed into a promise.
 *
 * @param  {object} request ej:{user:'tally', status:'active'}
 */
function promiseData(request){
  return $.ajax({
    type: 'GET',
    url: '/getTodos',
    data: request,
  });
}
