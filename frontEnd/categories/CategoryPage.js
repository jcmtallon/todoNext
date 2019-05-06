/*jshint esversion: 6 */
const OPTIONS = require('./../optionHandler/OptionHandler');
const categoryListView = require('./CategoryListView');
const AddCategoryForm = require('./addCategory_form');
const Page = require('./../pages/page');

/**
 * Represents the page where the user can introduce new categories,
 * remove and edit the existing ones. Consists of some top bar
 * buttons, a page title and a list of the existing categories.
 */

const listContainerID = 'categoryListView';


class CategoryPage extends Page{
  constructor(){
  super();

    // Add new category button.
    this.addCategoryBtn = {
      id: 'topBar_addCat_btn',
      text:'Add category',
      action: () =>{
          let addCatForm = new AddCategoryForm(this);
          addCatForm.displayForm();}
    };

    this._topBarBtns = [this.addCategoryBtn];
    this._pageTitle = 'Categories';
  }

  /**
   * Removes existing elements in the editor and editor
   * top bar and appends new elements for category view.
   */
  showPageWhFadeIn(){
    this.setPage();
    let categoryList = categoryListView.getList();
    this._Editor.insertContents(categoryList);
    categoryListView.fadeInList();
    }

  showPage(){

  }

  showPageWhHightlight(){

  }

  /**
   * Displays add category form in the app.
   */
  showAddCategoryForm(){
    let addCatForm = new AddCategoryForm(this);
    addCatForm.displayForm();
  }


  /**
   * Takes a category object, adds it to the user options
   * and refresh the page category list with the latest
   * category data.
   */
  addNewCategory(category){
    OPTIONS.Categories.addCategory(category);
    this.showPageWhFadeIn();
  }
}


module.exports = new CategoryPage();
