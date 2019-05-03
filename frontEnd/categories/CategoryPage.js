/*jshint esversion: 6 */
const categoryListView = require('./CategoryListView');
const AddCategoryForm = require('./addCategory_form');
const Page = require('./../pages/page');

/**
 * Represents the page where the user can introduce new categories,
 * remove and edit the existing ones. Consists of some top bar
 * buttons, a page title and a list of the existing categories.
 */

const listContainerID = 'categoryListView';

const addCategoryBtn = {
  id: 'topBar_addCat_btn',
  text:'Add category',
  action: function(){
      let addCatForm = new AddCategoryForm();
      addCatForm.setTitle('Add a new category');
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


    showAddCategoryForm(){
      let addCatForm = new AddCategoryForm(this);
      addCatForm.displayForm();
    }

    addNewCategory(category){
        console.log(category.title);
        console.log(category.color);
        console.log(category.description);
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
