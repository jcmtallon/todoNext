/*jshint esversion: 9 */
const OPTIONS = require('./../optionHandler/OptionHandler');
const HabitListView = require('./habitListView');
const AddHabitForm = require('./addHabitForm');
const Page = require('./../pages/page');
const MsgBox = require('./../messageBox/messageBox');


let _messanger = new MsgBox();

/**
 * Represents a page where the user can introduce new habits,
 * remove and edit the existing ones. Consists of some top bar
 * buttons, a page title and a list of the existing categories.
 */


class HabitPage extends Page{
  constructor(){
  super();

    this.pageName = 'habits';

    // Add new habit button.
    this.addHabitBtn = {
      text:'Add habit',
      action: () =>{
          let addHabitForm = new AddHabitForm(this);
          addHabitForm.displayForm();
        }
    };

    // Active all habits.
    this.activeteAllBtn = {
      text:'Activate all',
      action: () =>{
        this.activateAll();
        }
    };

    // Active all habits.
    this.deactivateAllBtn = {
      text:'Stop all',
      action: () =>{
        this.deactivateAll();
        }
    };

    this._topBarBtns = [this.addHabitBtn, this.deactivateAllBtn, this.activeteAllBtn];
    this._pageTitle = 'Habits';

    this.actions = {
       stopHabit: (id) => {this.stopHabit(id);},
       activateHabit: (id) => {this.activateHabit(id);},
       removeItem: (id) => {this.removeListItem(id);},
       editItem: (id) => {this.displayEditListItemForm(id);}
    };
  }


  /**
   * Removes existing elements in the editor and editor
   * top bar and appends new elements for category view.
   */
  showPage(){
    localStorage.setItem('currentPage', this.pageName);
    this.setPage();
    this.scrollPageToTop();
    this.listView = new HabitListView(this.actions);
    let habitList = this.listView.getList();
    this._Editor.insertContents(habitList);
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
    // this.showPage();
    // this.listView.highlightLastItem();
  }

  /**
   * Displays add habit form in the app.
   */
  showAddHabitForm(){
    let addHabitForm = new AddHabitForm(this);
    addHabitForm.displayForm();
  }


  /**
   * Takes a category object, adds it to the user options
   * and refresh the page category list with the latest
   * category data.
   */
  addNewCategory(category){
    // const callBack = () => {this.showPageWhHightlight();};
    // OPTIONS.categories.addCategory(category, callBack);
  }


  /**
   * Request the option object to update an existing category
   * and refresh the category page without applying any fade in
   * effects.
   */
  updateCategory(category){
    // const callBack = () => {this.showPage();};
    // OPTIONS.categories.updateCategory(category, callBack);
  }



  /**
   * Removes the selected habit from the local options object
   * and the db option object.
   */
  removeListItem(id){

    // Instantly remove target list item from list view.
    this.listView.removeItemById(id);

    let callback = null;
    let errorHandler = () =>{this.showPage();};

    OPTIONS.habits.removeHabitById(id, callback, errorHandler);
  }



  /**
   *  Sets specified habit isActive attribute to false and
   * refreshes the screen.
   */
  async stopHabit(id){

    OPTIONS.habits.stopById(id);
    this.showPage();

    try{
      await OPTIONS.habits.updateDb();

    } catch (err){
      _messanger.showMsgBox('An error occurred when stopping the habit. Please refresh the page and try again.','error','down');
      console.log(err);

      OPTIONS.habits.activateById(id);
      this.showPageWhFadeIn();
    }
  }


  /**
   *  Sets specified habit isActive attribute to true and
   * refreshes the screen.
   */
  async activateHabit(id){

    OPTIONS.habits.activateById(id);
    this.showPage();

    try{
      await OPTIONS.habits.updateDb();

    } catch (err){
      _messanger.showMsgBox('An error occurred when activating the habit. Please refresh the page and try again.','error','down');
      console.log(err);

      OPTIONS.habits.stopById(id);
      this.showPageWhFadeIn();
    }
  }


  /**
   * Sets all habit isActive attribute to true.
   */
  async activateAll(){

    const habitBackup = JSON.parse(JSON.stringify(OPTIONS.habits.getHabits()));

    OPTIONS.habits.activateAll();
    this.showPage();

    try{
      await OPTIONS.habits.updateDb();

    } catch (err){
      _messanger.showMsgBox('An error occurred when activating all habits. Please refresh the page and try again.','error','down');
      console.log(err);

      OPTIONS.habits.setHabits(habitBackup);
      this.showPageWhFadeIn();
    }
  }


  /**
   * Sets all habit isActive attribute to false.
   */
  async deactivateAll(){

    const habitBackup = JSON.parse(JSON.stringify(OPTIONS.habits.getHabits()));

    OPTIONS.habits.deactivateAll();
    this.showPage();

    try{
      await OPTIONS.habits.updateDb();

    } catch (err){
      _messanger.showMsgBox('An error occurred when deactivating all habits. Please refresh the page and try again.','error','down');
      console.log(err);

      OPTIONS.habits.setHabits(habitBackup);
      this.showPageWhFadeIn();
    }
  }



  /**
   * Displays addCatForm already populated with the
   * information from the passed category.
   */
  displayEditListItemForm(id){
    alert('alert!');
    // let targetCat = OPTIONS.categories.getCategoryById(id);
    // let addCatForm = new AddCategoryForm(this, targetCat);
    // addCatForm.displayForm();
  }
}


module.exports = new HabitPage();
