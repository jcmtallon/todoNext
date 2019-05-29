/*jshint esversion: 6 */
const DbHandler = require('./../DbHandler/DbHandler');

let _db;
let _userId;
let _activeTodos;

module.exports = class ActiveTodos{
  constructor(activeTodos, userId){
    _activeTodos = activeTodos;
    _userId = userId;
    _db = new DbHandler();
  }


  /**
   * Saves all received todos into the todoList array
   * inside the options object. This array is used later to remember in which order the todos must
   * be displayed in the todo main list.
   * @param  {[Object]}
   */
  addTodos(todos){
      for (let i=0; i< todos.length;i++){addSingleTodo(todos[i],'');}
      updateDatabase();
  }


  /**
   * Removes todo from todolist in option object.
   * @param  {String} id todo id
   */
  removeTodoById(id){
    removeTodo(id);
    updateDatabase();
  }

  /**
   * Updates todo index and date in todolist array
   * when the user changes the position in the main list.
   * @param  {object} updatedTodo todo item received by the db.
   * @param  {type} referenceId id of the todo list item next to wich the new todo is going to be placed in.
   * @param  {type} over        indicates if the new todo is over the reference todo or not in the list.
   */
  updateTodoIndex(updatedTodo, referenceId, over){
    removeTodo(updatedTodo._id);
    addSingleTodo(updatedTodo, referenceId, over);
    updateDatabase();
  }
};


/**
 * Patches data into database.
 */
function updateDatabase(){
    _db.updateOptions(_userId, {todoList: _activeTodos});
}



/**
 * Removes single todo from the option object todolist array.
 * @param  {String} id todo id
 */
function removeTodo(id){

  // Loop war file todolist object until you find the corresponding item.
  for(let i=0; i<_activeTodos.length; i++){
    for(let j=0;j<_activeTodos[i].todos.length;j++){
      if(_activeTodos[i].todos[j].id==id){

        // If the date only has one element, remove the whole date item.
        if(_activeTodos[i].todos.length==1){
          _activeTodos.splice( i, 1 );

        // If the date has multiple elements, remove the target item and
        // update the index of the rest of the elements.
        }else{
          let indexToReplace = _activeTodos[i].todos[j].index;
          _activeTodos[i].todos.splice( j, 1 );
          for(let k=0; k<_activeTodos[i].todos.length; k++){
            if(_activeTodos[i].todos[k].index>indexToReplace){
              _activeTodos[i].todos[k].index--;
            }
          }
        }
      break;
      }
    }
  }

}



/**
 * Adds single todo to todoList array, finding the
 * right date slot and index value for it.
 * @param  {object} todo      db todo item.
 * @param  {string} referenceId  id of the todo list item next to wich the new todo is going to be placed in.
 * @param  {boolean} over      indicates if the new todo is over the reference todo or not in the list.
 * @return {type}             description
 */
function addSingleTodo(todo, referenceId, over){

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
  for (let i=0; i<_activeTodos.length; i++){

    let warDate = new Date(_activeTodos[i].date);
    let sameDay = (todoDate.getDate() == warDate.getDate())? true:false;
    let sameMonth = (todoDate.getMonth() == warDate.getMonth())? true:false;
    let sameYear = (todoDate.getFullYear() == warDate.getFullYear())? true:false;

    if(sameDay && sameMonth && sameYear){
        dateExists=true;

        switch (referenceId) {

          // If referenceId is empty, just insert new todo at the end.
          case '':
            newTodo.index = _activeTodos[i].todos.length;
            break;

          // If received 'first', add new todo as the first item.
          case 'first':
            for (let j=0;j<_activeTodos[i].todos.length;j++){
              _activeTodos[i].todos[j].index++;}
            newTodo.index = 0;
          break;

          // Else we assume a proper reference id was received.
          // Find the index of the reference, insert the new todo
          // and adjust the rest of indexes based on the given position.
          default:
          let reference = _activeTodos[i].todos.find (obj => {
            return obj.id == referenceId;});
          newTodo.index = (over) ? reference.index : reference.index+1;
          for (let k=0; k < _activeTodos[i].todos.length; k++){
            if(_activeTodos[i].todos[k].index>=newTodo.index){
              _activeTodos[i].todos[k].index++;
            }
          }
        }
        _activeTodos[i].todos.push(newTodo);

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

    _activeTodos.splice(targetIndex, 0, dateAndTodo);
  }
}
