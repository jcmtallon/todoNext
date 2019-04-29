/*jshint esversion: 6 */
const Page = require('./../pages/page');


const filterBtn = {
  id: 'activeTodos_filterBtn',
  text:'Filter',
  action: function(){
      alert('Filter: coming soon!');}
};

const undoBtn = {
  id: 'activeTodos_undoBtn',
  text:'Undo',
  action: function(){
      alert('Undo: coming soon!');}
};

const logoutBtn = {
  id: 'activeTodos_logout',
  text:'Logout',
  action: function(){
    window.open('/users/logout','_self');}
};



class CategoryPage extends Page{
  constructor(){
  super();
  }

  showPageWithFadeIn(){
    this.removeCurrentPage();
    this._Editor.setTitle('Test');
    this._EditorTopBar.addButon(filterBtn);
    this._EditorTopBar.addButon(undoBtn);
    this._EditorTopBar.addButon(logoutBtn);
  }

}

module.exports = new CategoryPage();
