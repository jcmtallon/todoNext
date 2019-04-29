/*jshint esversion: 6 */
const categoryListView = require('./CategoryListView');
const AddCategoryForm = require('./../forms/addCategory_form');
const Page = require('./../pages/page');

/**
 * TODO:
 */

const listContainerID = 'categoryListView';

const addCategoryBtn = {
  id: 'topBar_addCat_btn',
  text:'Add category',
  action: function(){
      let addCatForm = new AddCategoryForm();
      addCatForm.displayForm();}
};


class CategoryPage extends Page{
  constructor(){
  super();
  }

  /**
   * Removes existing elements in the editor and editor
   * top bar and appends new elements for category view.
   */
  showPage(){
    this.removeCurrentPage();
    this._EditorTopBar.addButon(addCategoryBtn);
    this._Editor.setTitle('Categories');
    this._Editor.insertPageContainer(createPageContainer());
    categoryListView.displayCategoriesWithFadeIn(listContainerID);
    }
}


function createPageContainer(){
  let ol = $('<ol>', {
    id:listContainerID,
    tabindex:'0',
    class: 'stdListContainer'});
  return ol;
}

module.exports = new CategoryPage();
