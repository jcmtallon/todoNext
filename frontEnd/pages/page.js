/*jshint esversion: 6 */
const editorTopBar = require('./../screens/editorTopBar/editorTopBar');
const editor = require('./../screens/editor/editor');


module.exports = class Page{
  constructor(){
    this._EditorTopBar = editorTopBar;
    this._Editor = editor;
  }

  removeCurrentPage(){
    this._EditorTopBar.clearContents();
    this._Editor.clearContents();
  }
};
