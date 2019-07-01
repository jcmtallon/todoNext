/*jshint esversion: 9 */
const MsgBox = require('./../messageBox/messageBox');

/**
 * Various utilities for the application.
 */
class Utilities{
  constructor(){
    this.messenger = new MsgBox();
  }


  /**
   * Returns a true value if the Internet connection is
   * lost, displays an error message and executes a callback
   * (if pased)
   * @return {Boolean}  description
   */
  noConnection(callback){
    if(!navigator.onLine){
      this.messenger.showMsgBox('Failed to perform task.\nCheck if there is an internet connection.','error','down');
      if(callback!=undefined){callback();}
      return true;
    }
  }


}

module.exports = new Utilities();
