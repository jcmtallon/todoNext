/*jshint esversion: 6 */
const EventEmitter = require('events');
const DbHandler = require('./../DbHandler/DbHandler');

/** @module
 *  Module in charge of reading and updating the options set by the user.
 */

 let OPTIONS;
 let db;
 let userId;

class Options extends EventEmitter{
  constructor(){
    super();

    // User data and options are stored at the very end of the main view ejs file.
    // Before the user gets see it, we retrieve the data form the ejs and
    // remove the element from the view to leave no trace.
    let user = JSON.parse($('#variableJSON').text());
    $('#variableJSON').remove();

    OPTIONS = user.options;
    userId = user._id;

    // Loads dbhandler so this class can send options updates to the db.
    db = new DbHandler();

  }

  get id(){
    return userId;
  }

  get options(){
    return OPTIONS;
  }



  /**
   * registerTodos - Saves all received todos into the todoList array
   * inside the options object.
   * This array is used later to remember in which order the todos must
   * be displayed in the todo main list.
   *
   * @param  {[Object]} todos
   */
  registerTodos(todos){
      for (let i=0; i< todos.length;i++){addTodo(todos[i],'');}
      updateDatabase();
  }


  /**
   * removeTodoFromList - Removes todo from todolist in option object.
   *
   * @param  {String} id todo id
   */
  removeTodoById(id){
    removeTodo(id);
    updateDatabase();
  }

  /**
   * updateTodoPosition - Updates todo index and date slow in war file
   * todoList array when user changes the position in the main list.
   *
   * @param  {object} updatedTodo todo item received by the db.
   * @param  {type} referenceId id of the todo list item next to wich the new todo is going to be placed in.
   * @param  {type} over        indicates if the new todo is over the reference todo or not in the list.
   */
  updateTodoIndex(updatedTodo, referenceId, over){

    removeTodo(updatedTodo._id);
    addTodo(updatedTodo, referenceId, over);
    updateDatabase();

  }

}



/**
 * updateDatabase - Patches data into database afer waiting 1000s
 * to avoid slowing down other proceses.
 */
function updateDatabase(){
  setTimeout( () => {
    db.updateOptions(userId, {todoList: OPTIONS.todoList});
  }, 1000);
}



/**
 * removeTodo - Removes single todo from optiopn todolist array.
 *
 * @param  {String} id todo id
 */
function removeTodo(id){

  // Loop war file todolist object until you find the corresponding item.
  for(let i=0; i<OPTIONS.todoList.length; i++){
    for(let j=0;j<OPTIONS.todoList[i].todos.length;j++){
      if(OPTIONS.todoList[i].todos[j].id==id){

        // If the date only has one element, remove the whole date item.
        if(OPTIONS.todoList[i].todos.length==1){
          OPTIONS.todoList.splice( i, 1 );

        // If the date has multiple elements, remove the target item and
        // update the index of the rest of the elements.
        }else{
          let indexToReplace = OPTIONS.todoList[i].todos[j].index;
          OPTIONS.todoList[i].todos.splice( j, 1 );
          for(let k=0; k<OPTIONS.todoList[i].todos.length; k++){
            if(OPTIONS.todoList[i].todos[k].index>indexToReplace){
              OPTIONS.todoList[i].todos[k].index--;
            }
          }
        }
      break;
      }
    }
  }

}



/**
 * addTodo - Adds single todo to war file todoList array, finding the
 * right date slot and index value for it.
 *
 * @param  {object} todo      db todo item.
 * @param  {string} referenceId  id of the todo list item next to wich the new todo is going to be placed in.
 * @param  {boolean} over      indicates if the new todo is over the reference todo or not in the list.
 * @return {type}             description
 */
function addTodo(todo, referenceId, over){

  // Item to be added to the war file todolist array.
  const newTodo = {id: todo._id,
                  index: 0,
                  name:todo.name};

  // If date exists in current list, returns true.
  let dateExists = false;

  // In case date does not exist in war file todo list, we use
  // this variable to find the index in which we should add the
  // new item so all items in the war file todo list are in a
  // chornological order.
  let targetIndex = 0;

  // Used to compare dates between the new todo and the war file.
  let todoDate = new Date(todo.dueTo);

  // Check item by item in the todoList of the war file if
  // the date matches.
  // If the date matches, the new todo is added to that item array
  // in the last position. If it doesn't match the new todo is added
  // as a new date item to the list war.
  for (let i=0; i<OPTIONS.todoList.length; i++){

    let warDate = new Date(OPTIONS.todoList[i].date);
    let sameDay = (todoDate.getDate() == warDate.getDate())? true:false;
    let sameMonth = (todoDate.getMonth() == warDate.getMonth())? true:false;
    let sameYear = (todoDate.getFullYear() == warDate.getFullYear())? true:false;

    if(sameDay && sameMonth && sameYear){
        dateExists=true;

        switch (referenceId) {

          // If referenceId is empty, just insert new todo at the end.
          case '':
            newTodo.index = OPTIONS.todoList[i].todos.length;
            break;

          // If received 'first', add new todo as the first item.
          case 'first':
            for (let j=0;j<OPTIONS.todoList[i].todos.length;j++){
              OPTIONS.todoList[i].todos[j].index++;}
            newTodo.index = 0;
          break;

          // Else we assume a proper reference id was received.
          // Find the index of the reference, insert the new todo
          // and adjust the rest of indexes based on the given position.
          default:
          let reference = OPTIONS.todoList[i].todos.find (obj => {
            return obj.id == referenceId;});
          newTodo.index = (over) ? reference.index : reference.index+1;
          for (let k=0; k < OPTIONS.todoList[i].todos.length; k++){
            if(OPTIONS.todoList[i].todos[k].index>=newTodo.index){
              OPTIONS.todoList[i].todos[k].index++;
            }
          }
        }
        OPTIONS.todoList[i].todos.push(newTodo);

    }
    // We find out the location in which we would add the new item
    // inside the war file todolist in case the date does not
    // exist.
    targetIndex = (todoDate > warDate) ? i+1 : targetIndex;
    if (dateExists) { break; }
  }

  // If date does not exist, we add new todo into corresponding
  // chronological order.
  if(dateExists==false){
    let dateAndTodo = {
      date: todo.dueTo,
      todos:[newTodo]
    };

    OPTIONS.todoList.splice(targetIndex, 0, dateAndTodo);
  }
}

 module.exports = new Options();
