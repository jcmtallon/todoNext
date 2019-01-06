/*jshint esversion: 6 */
const EventEmitter = require('events');


module.exports = class WarWriter extends EventEmitter{
  constructor(){
    super();
    this._user = 'tally';

  }


  /**
   * getActiveTodosWarDataAndPrint - Gets war file data, compiles it
   * together with the active todos data into an objects, and sends this
   * object to the todoListView class so it can print the todos in the
   * order customized by the user.
   *
   * @param  {object} activeTodos collection of active todos in db.
   * @return {emit}               event to todoListView class with object
   * including war file data and active todo data.
   */
  getActiveTodosWarDataAndPrint(activeTodos, newTodoId, fadein){
    const promisedData = promiseData({userName:this._user});
    promisedData.done((warData)=>{
      this._warData = warData;

      const printRequest = {
        warData: warData,
        todos: activeTodos,
        newTodoId: newTodoId,
        fadein: fadein
      };

      this.emit('printTodos', printRequest);

    });
  }



  /**
   * getWarData - Method in charge of retrieving all the data from the war file.
   *
   * @return {object} War file data.
   */
  getWarData(){
    const promisedData = promiseData({userName:this._user});
    promisedData.done((data)=>{
      this._warData = data;
    });
  }




   /**
    * addTodosToWarData - Receives an array of new todos from the db, adds it to the
    * war file todoList array (assigning it the right date and index),
    * and saves the data back into the res file.
    *
    * @param  {array} todos array of todo objects.
    * @return {emit}
    */
   addTodosToWarData(todos){

     // Gets config war file data.
     const promisedData = promiseData({userName:this._user});


     // Wait until war file data has been obtained.
     promisedData.done((data)=>{

       this._warData = data;

       for (let i=0; i< todos.length;i++){
         this.addTodo(todos[i],'');
       }

       // We codify the data so it can be correctly sent with the
       // ajax method.
       const delivery = {userName: this._user,
                         data: JSON.stringify(this._warData,null,2)};

       $.ajax({
         type: 'POST',
         url: '/writeWar',
         data: delivery,
         success: (data) =>{
           this.emit('newTodosSaved');
         }
       });

     });

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
   addTodo(todo, referenceId, over){

     // Item to be added to the war file todolist array.
     const newTodo = {id: todo._id,
                     index: 0};

     // If date exists in current list, returns true.
     let dateExists=false;

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
     for (let i=0; i<this._warData.todoList.length; i++){

       let warDate = new Date(this._warData.todoList[i].date);
       let sameDay = (todoDate.getDate() == warDate.getDate())? true:false;
       let sameMonth = (todoDate.getMonth() == warDate.getMonth())? true:false;
       let sameYear = (todoDate.getFullYear() == warDate.getFullYear())? true:false;

       if(sameDay && sameMonth && sameYear){
           dateExists=true;

           switch (referenceId) {

             // If referenceId is empty, just insert new todo at the end.
             case '':
               newTodo.index = this._warData.todoList[i].todos.length;
               break;

             // If received 'first', add new todo as the first item.
             case 'first':
               for (let j=0;j<this._warData.todoList[i].todos.length;j++){
                 this._warData.todoList[i].todos[j].index++;}
               newTodo.index = 0;
             break;

             // Else we assume a proper reference id was received.
             // Find the index of the reference, insert the new todo
             // and adjust the rest of indexes based on the given position.
             default:
             let reference = this._warData.todoList[i].todos.find (obj => {
               return obj.id == referenceId;});
             newTodo.index = (over) ? reference.index : reference.index+1;
             for (let k=0;k<this._warData.todoList[i].todos.length;k++){
               if(this._warData.todoList[i].todos[k].index>=newTodo.index){
                 this._warData.todoList[i].todos[k].index++;
               }
             }
           }
           this._warData.todoList[i].todos.push(newTodo);

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

       this._warData.todoList.splice(targetIndex, 0, dateAndTodo);
     }
   }


  /**
   * removeTodoFromWar - Removes todo from todolist in resource file.
   *
   * @param  {string} id id of todo to remove
   */
  removeTodoFromWar(id){

    // Gets config war file data.
    const promisedData = promiseData({userName:this._user});

    // Wait until war file data has been obtained.
    promisedData.done((data)=>{
      this._warData = data;
      this.removeTodo(id);

      // We codify the data so it can be correctly sent with the
      // ajax method.
      const delivery = {userName: this._user,
                        data: JSON.stringify(this._warData,null,2)};

      $.ajax({
        type: 'POST',
        url: '/writeWar',
        data: delivery,
        success: (data) =>{}
        });
      });
    }



  /**
   * removeTodo - Removes single todo from war file todolist array.
   *
   * @param  {string} id id of item to be removed.
   */
  removeTodo(id){

    // Loop war file todolist object until you find the corresponding item.
    for(let i=0;i<this._warData.todoList.length;i++){
      for(let j=0;j<this._warData.todoList[i].todos.length;j++){
        if(this._warData.todoList[i].todos[j].id==id){

          // If the date only has one element, remove the whole date item.
          if(this._warData.todoList[i].todos.length==1){
            this._warData.todoList.splice( i, 1 );

          // If the date has multiple elements, remove the target item and
          // update the index of the rest of the elements.
          }else{
            let indexToReplace = this._warData.todoList[i].todos[j].index;
            this._warData.todoList[i].todos.splice( j, 1 );
            for(let k=0;k<this._warData.todoList[i].todos.length;k++){
              if(this._warData.todoList[i].todos[k].index>indexToReplace){
                this._warData.todoList[i].todos[k].index--;
              }
            }
          }
        break;
        }
      }
    }

  }



  /**
   * updateTodoPosition - Updates todo index and date slow in war file
   * todoList array when user changes the position in the main list.
   *
   * @param  {object} updatedTodo todo item received by the db.
   * @param  {type} referenceId id of the todo list item next to wich the new todo is going to be placed in.
   * @param  {type} over        indicates if the new todo is over the reference todo or not in the list.
   * @return {object}           saves data back into war file.
   */
  updateTodoPosition(updatedTodo, referenceId, over){

    // Gets config war file data.
    const promisedData = promiseData({userName:this._user});

    // Wait until war file data has been obtained.
    promisedData.done((data)=>{

      this._warData = data;

      // Remove old object.
      this.removeTodo(updatedTodo._id);

      // Add new object based on the new index determined by the user.
      this.addTodo(updatedTodo, referenceId, over);

      // We codify the data so it can be correctly sent with the
      // ajax method.
      const delivery = {userName: this._user,
                        data: JSON.stringify(this._warData,null,2)};

      $.ajax({
        type: 'POST',
        url: '/writeWar',
        data: delivery,
        success: (data) =>{}
        });

    });

  }
};




/**
 * promiseData - Gets target user config data from war file on server.
 *
 * @param  {object} request ej:  {userName:this._user}
 * @return {type}         Returns ajax. Used together with .done as an alternative
 *                        to a callback
 */
function promiseData(request){
    return $.ajax({
      type: 'POST',
      url: '/readWar',
      data: request,
    });
}
