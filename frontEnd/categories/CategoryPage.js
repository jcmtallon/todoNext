/*jshint esversion: 9*/
const OPTIONS = require('./../optionHandler/OptionHandler');
const CategoryListView = require('./CategoryListView');
const AddCategoryForm = require('./addCategory_form');
const Page = require('./../pages/page');
const MsgBox = require('./../messageBox/messageBox');

let _messanger = new MsgBox();

/**
 * Represents the page where the user can introduce new categories,
 * remove and edit the existing ones. Consists of some top bar
 * buttons, a page title and a list of the existing categories.
 */


class CategoryPage extends Page{
  constructor(){
  super();

    this.pageName = 'categories';

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

    this.actions = {
       removeItem: (id) => {this.removeListItem(id);},
       editItem: (id) => {this.displayEditListItemForm(id);}
    };
  }






  //------------ Display page methods -----------//

  /**
   * Removes existing elements in the editor and editor
   * top bar and appends new elements for category view.
   */
  showPage(noScroll){
    localStorage.setItem('currentPage', this.pageName);
    this.setPage();
    if(!noScroll){this.scrollPageToTop();}
    this.listView = new CategoryListView(this.actions);
    let categoryList = this.listView.getList();
    this._Editor.insertContents(categoryList);
  }

  /**
   * Shows page iwth a fade in effect.
   */
  showPageWhFadeIn(){
    this.showPage();
    this.listView.fadeInList();
  }

  /**
   * Shows page, scrolls to the bottom of the list
   * and hightlights the last list item. Used for
   * when a new item is added to the list.
   */
  showPageWhHightlight(){
    this.showPage();
    this.listView.highlightLastItem();
  }

  /**
   * Shows page without scrolling the screen.
   */
  showPageWithoutScroll(){
    let noScroll = true;
    this.showPage(noScroll);
  }







  //------------ Forms display -----------//

  /**
   * Displays add category form in the app.
   */
  showAddCategoryForm(){
    let addCatForm = new AddCategoryForm(this);
    addCatForm.displayForm();
  }

  /**
   * Displays addCatForm already populated with the
   * information from the passed category.
   */
  displayEditListItemForm(id){
    let targetCat = OPTIONS.categories.getCategoryById(id);
    let addCatForm = new AddCategoryForm(this, targetCat);
    addCatForm.displayForm();
  }





//------------ Category methods  ------------------------//

  /**
   * Takes a category object, adds it to the user options
   * and refresh the page category list with the latest
   * category data.
   */
  addNewCategory(category){
    const callBack = () => {this.showPageWhHightlight();};
    OPTIONS.categories.addCategory(category, callBack);
  }

  /**
   * Request the option object to update an existing category
   * and refresh the category page without applying any fade in
   * effects.
   */
  async updateCategory(category){

    let catBackup = OPTIONS.categories.getCategoryById(category.id);
    OPTIONS.categories.updateCategory(category);
    this.showPageWithoutScroll();

    try{
      await OPTIONS.categories.updateDb();

    }catch(err){
      _messanger.showMsgBox('Failed to update category data. Please refresh the page and try again.','error','down');
      console.log(err);
      OPTIONS.categories.updateCategory(catBackup);
      this.showPageWhFadeIn();
    }
  }

  /**
   * Removes the selected category from the options object,
   * updates the database with the new cat info, and
   * refreshes the page.
   */
  removeListItem(id){
    OPTIONS.categories.removeCategoryById(id);
    this.showPageWithoutScroll();
  }


}


module.exports = new CategoryPage();
