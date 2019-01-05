/*jshint esversion: 6 */
const MsgBox = require('./../messageBox/messageBox');

module.exports = class Swipe{

  /**
   * constructor - Using the public script slip, it addes the slip(swipe)
   * functionality to the list items.
   *
   */
  constructor(listController){

    this._messenger = new MsgBox();

    this._listController = listController;

    // Used for getting specific list items using the index.
    this._mainListItems = $('#mainList li');

    // Used to add event listeners to the swipe acctions
    this._ol= document.getElementById('mainList');

    this.preventReorder();
    this.saveSwipeDirection();
    this.colorizeTodo();
    this.cancelTodo();
    this.preventSwipe();
    this.enableReorder();
    this.actionExecuter();
    this.reorder();

    new Slip(this._ol);

  }



/**
 * preventReorder - Items with the class /demo-no-reorder/cannot be
 * reordered in the list.
 *
 * @return nothing
 */
preventReorder(){

  this._ol.addEventListener('slip:beforereorder', function(e){
      if (/demo-no-reorder/.test(e.target.className)) {
          e.preventDefault();
      }
  }, false);

}



/**
 * saveSwipeDirection - Saves the direction of the swipe.
 *
 * @return Saves index and direction of the swipped item.
 */
saveSwipeDirection(){

  this._ol.addEventListener('slip:swipe', (e) =>{
    this._direction = e.detail.direction;
    this._index = e.detail.originalIndex;
  },false);

}


/**
 * colorizeTodo - Changes the todo task color to green or red depending the direction.
 */
colorizeTodo(){

  this._ol.addEventListener('slip:animateswipe',function(e){
    if(e.detail.x>0){
        e.target.style.opacity  = 1-(e.detail.x/600);
        e.target.style.backgroundColor = 'rgb(' + [255-((e.detail.x*10)/300),255,255-((e.detail.x*10)/300)].join(',') +')';
    }else{
        e.target.style.opacity  = 1-(-e.detail.x/600);
        e.target.style.backgroundColor = 'rgb(' + [255,255-((-e.detail.x*10)/200),255-((-e.detail.x*10)/200)].join(',') +')';
    }
  });
}


/**
 * cancelTodo - If for some reason, the swipe gets cancelled, the todo item goes back to
 *  its original opacity and color values.
 *
 * @return {type}  description
 */
cancelTodo(){

  this._ol.addEventListener('slip:cancelswipe',function(e){
    e.target.style.opacity  = 1;
    e.target.style.backgroundColor = 'rgb(255,255,255)';
    console.log('cancelled!');
  });
}



/**
 * preventSwipe - Items with the class /demo-no-reorder/ or /INPUT/ cannot be
 * swipped in the list.
 */
preventSwipe(){

  this._ol.addEventListener('slip:beforeswipe', function(e){
      if (e.target.nodeName == 'INPUT' || /demo-no-swipe/.test(e.target.className)) {
          e.preventDefault();
      }
  }, false);
}



/**
 * enableReorder - This seems to be the method that enables the reorder functionality.
 */
enableReorder(){
  this._ol.addEventListener('slip:beforewait', function(e){
      if (e.target.className.indexOf('instant') > -1)
      e.preventDefault();
  }, false);
}




/**
 * actionExecuter - Execute the following actions when todos are swipped:
 *  Left: Marks todo as "Removed" and removes it from the list.
 *  Right: Marks todo as "Completed" and removes i from the list.
 * @return Removes the item directly from the list.
 */
actionExecuter(){

    // Removes or completes the todo depending on the direction of the swipe.
    this._ol.addEventListener('slip:afterswipe', (e) =>{

      if(navigator.onLine){

        if(this._direction=='left'){

            // Remove object from list
            e.target.parentNode.removeChild(e.target);
            // Remove object from db and war
            this._listController.removeTodoFromDb(e.target.id);

        }else{
          e.target.parentNode.removeChild(e.target);
        }

        this.minimizeHeader();

        // If not connected to the Internet, restart todo and show error message.
      }else{
        e.target.style.opacity  = 1;
        e.target.style.backgroundColor = 'rgb(255,255,255)';
        this._messenger.showMsgBox('Failed to remove item. \nCheck if there is an internet connection.','error','down');
      }
    }, false);
  }



  /**
   * minimizeHeader - Minimizes header if a period went empty in the todo list.
   * Reason why not asking this to the todolist_view class : Because that class
   * applies changes based on the most recent status of the war file. Having
   * to check the war file and reprint all the todos takes time and that is not very
   * compatible with this swipe class. The animation does not look clean and fast.
   *
   * @return Directly changes header margin on the list (when necessary)
   */
  minimizeHeader(){

    // Get the latest version of the list.
    this._mainListItems = $('#mainList li');

    // If last item in the list, we know there is no need to minimize.
    // So we exit the method after getting the latest status of the list.
    if(this._mainListItems.length==this._index){
      return;
    }

    // If next item is a header, this could be a sign that the previos period went empty.
    if(this._mainListItems[this._index].className=='demo-no-reorder demo-no-swipe list_header'){

        // If the previous item is a header of the beginning of the list, we know the period went empty.
        if(this._index==0 || this._mainListItems[this._index-1].className=='demo-no-reorder demo-no-swipe list_header'){
          this._mainListItems[this._index].style.marginTop='30px';
        }
    }
  }



  /**
   * maximizeHeader - Mazimizes header (adds a top margin) if the previos period
   * went empty in the todo list. To make the UI look cleaner.
   *
   * @return {type}  description
   */
  maximizeHeader(){

    // If last item in the list, we know there is no need to mazimize.
    if(this._mainListItems.length==this._newIndex+1){
      return;
    }

    // If next item is a header, then this header needs to be expanded.
    if(this._mainListItems[this._newIndex+1].className=='demo-no-reorder demo-no-swipe list_header'){
      this._mainListItems[this._newIndex+1].style.marginTop='95px';
    }

  }



  /**
   * reorder - description
   *
   * @return {type}  description
   */
  reorder(){

    this._ol.addEventListener('slip:reorder', (e)=>{
        e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);

        // If item position does not change, do nothing.
        if(e.detail.originalIndex == e.detail.spliceIndex){
          return false;
        }

        // Get the index before reordering.
        this._index=e.detail.originalIndex;
        this._newIndex = e.detail.spliceIndex;

        // If the item was moved from a top to a bottom position, we added
        // one to the index so the minimization method is applied to the
        // correct item.
        if(e.detail.originalIndex > e.detail.spliceIndex){
          this._index++;
        }

        // Adds and removes top margin to the headers depending on if they went
        // empty or not.
        this.minimizeHeader();
        this.maximizeHeader();

        this.updateItemDate();

        return false;
    }, false);

  }

  updateItemDate(){

    let newDate = new Date();
    let referenceId;
    let currentId = this._mainListItems[this._newIndex].id;
    let over = true;

    // If todo became the first item of the list, war index becomes 0 and
    // if previos element is Today header, gets Today-1day, else gets the same
    // date as the previos todo.
    if(this._newIndex==0){

      if(this._mainListItems[1].className=='demo-no-reorder demo-no-swipe list_header'){
        newDate.setDate(newDate.getDate()-1);
      }else{
        newDate = new Date(this._mainListItems[1].getAttribute('data-date'));
      }
      referenceId='first';

    // If previos list item is a header, gets the header date.
    }else if(this._mainListItems[this._newIndex-1].className=='demo-no-reorder demo-no-swipe list_header'){

      switch (this._mainListItems[this._newIndex-1].textContent) {
        case 'Today':
          break;
        case 'Tomorrow':
          newDate.setDate(newDate.getDate()+1);
          break;
        case 'To come':
          newDate.setDate(newDate.getDate()+2);
          break;
        default:
      }
      referenceId='first';

    // If next item in list is a todo, takes the reference id and date from it.
    }else if(this._mainListItems.length>this._newIndex+1 && this._mainListItems[this._newIndex+1].className=='task_item task'){
      newDate = new Date(this._mainListItems[this._newIndex+1].getAttribute('data-date'));
      referenceId = this._mainListItems[this._newIndex+1].id;

    // Else we assume that there is a todo right on top and we take the data from it.
    }else{
      newDate = new Date(this._mainListItems[this._newIndex-1].getAttribute('data-date'));
      referenceId = this._mainListItems[this._newIndex-1].id;
      over = false;
    }



    //Get dueTo container element.
    let itemToUpdate = $('#'+currentId + ' .task_deadline');

    function short_month(dt){
      let shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return shortMonths[dt.getMonth()];
    }

    // Wait until margin transition has been completed to apply fade animation and change the date.
    setTimeout( () => {
      itemToUpdate.fadeOut(500);
      setTimeout( () => {
        itemToUpdate.text(short_month(newDate) + ' ' + newDate.getDate()).fadeIn(500);
        this._mainListItems[this._newIndex].setAttribute('data-date', newDate);
      }, 500);
    }, 800);


    if(navigator.onLine){

      // Update index and date in db and warp file.
      this._listController.updatePosition(currentId,referenceId,newDate, over);

    }else{
      this._messenger.showMsgBox('Failed to save the changes\ndue to connection issues.\nCheck your internet connection\nand refresh the page.','error','down');
    }
  }

};
