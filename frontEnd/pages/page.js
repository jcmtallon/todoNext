const OPTIONS = require('./../optionHandler/OptionHandler');
const editorTopBar = require('./../screens/editorTopBar/editorTopBar');
const editor = require('./../screens/editor/editor');
const flashMsg = require('./../messageBox/flashMsg');

/**
 * Represents an empty page with methods for emptying the page,
 * loading buttons into the page tob bar, adding a page title
 * and others.
 */
module.exports = class Page{
  constructor(){

    // Components in charge of manipulating the edito top bar
    // and the editor.
    this._EditorTopBar = editorTopBar;
    this._Editor = editor;

    this._topBarBtns =[];
    this._pageTitle = '';
    this._pageContent = '';

    this.OPTIONS = OPTIONS;
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


  /**
   * Scrolls page to top position.
   */
  scrollPageToTop(){
    $(window).scrollTop(0);
  }

  /**
   *  Removes all elements from page container
   */
  removeCurrentPage(){
    this._EditorTopBar.clearContents();
    this._Editor.clearContents();
  }

  /**
   * Saves current page name into local storage.
   */
  updateLocalStorage(){
    localStorage.setItem('currentPage',this.pageName);
  }

  /**
   * Function used to prevent that we load the page contents
   * into a different page.
   */
  _pageIsOpen(page){
    let currentPage = localStorage.getItem('currentPage');
    return (currentPage == page.pageName);
  }


  /**
   * Scrolls page to top when requested.
   */
  _scrollPage(query){
    if(query != undefined && query.scrollToTop){
      this.scrollPageToTop();
    }
  }

  /**
   * Applies fade in effect to page when requested.
   */
  _fadeIn(query){
    if (query != undefined && query.fadeIn){
      this.listView.fadeInList();
    }
  }

  /**
   * Applies hightlight effect to list item when requested.
   */
  _hightlightItem(query){
    if (query != undefined && query.highlightId != ''){
      this.listView.hightlightByInstantId(query.highlightId);
    }
  }


  /**
   * Displays popup message on top of page when requested.    
   */
  _displayMsg(query){
    if (query != undefined && query.hasOwnProperty('msg')){
      flashMsg.showPlainMsg(query.msg);
    }
  }
};
