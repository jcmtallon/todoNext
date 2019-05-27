/*jshint esversion: 6 */
const editorTopBar = require('./../screens/editorTopBar/editorTopBar');
const editor = require('./../screens/editor/editor');
const MsgBox = require('./../messageBox/messageBox');


/**
 * Represents an empty page with methods for resetting the page,
 * loading buttons into the page tob bar, adding a page title
 * and others.
 */


module.exports = class Page{
  constructor(){
    // To make these app screens accessible by the page.
    this._EditorTopBar = editorTopBar; //TODO: need to expose?
    this._Editor = editor; //TODO: need to expose?

    // Page elements
    this._topBarBtns =[];
    this._pageTitle = '';
    this._pageContent = '';

    // Messanger
    this.messanger = new MsgBox();
  }


  /**
   *  Removes previous page content, title and buttons, and
   *  adds new buttons and a new title (when
   *  there is one).
   */
  setPage(){
    this.removeCurrentPage();
    this._EditorTopBar.addButtons(this._topBarBtns);

    if(this._pageTitle!=''){
      this._Editor.setTitle(this._pageTitle);
    }
  }

  scrollPageToTop(){
    $(window).scrollTop(0);
  }

  /**
   *  Cleans page container
   */
  removeCurrentPage(){
    this._EditorTopBar.clearContents();
    this._Editor.clearContents();
  }

  /**
   *  Tells local storage which is the current page.
   */
  updateLocalStorage(){
    localStorage.setItem('currentPage',this.pageName);
  }

};
