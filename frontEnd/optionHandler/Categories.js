/*jshint esversion: 9 */
const Category = require('./../categories/Category.js');
const DbHandler = require('./../DbHandler/DbHandler');
const MsgBox = require('./../messageBox/messageBox');

 let _db;
 let _userId;
 let _categories;
 let _messanger;

module.exports = class Categories{
  constructor(categories, userId){
    _categories = categories;
    _userId = userId;
    _db = new DbHandler();
    _messanger = new MsgBox();
  }


  /**
   * Returns array with all saved category
   * db objects.
   */
  getCategories(){
    return _categories;
  }

  setCategories(categories){
    _categories = categories;
  }


  /**
   * Returns category class instance for
   * the selected category.
   */
  getCategoryById(id){
    let dbCat = _categories.find (obj => {return obj._id == id;});
    if (dbCat != undefined){
      let cat =  new Category(dbCat);
      return cat;
    }
  }


  /**
   * Receives a category object and the
   * callback to perform as soon as the
   * category has been correctly saved to
   * the database. Returns the callback.
   */
  addCategory(category, callback){
    let dbCat = category.categoryToDbObject();
    _categories.push(dbCat);
    updateDatabase(callback);
  }



  /**
   * Saves the category only in the local option object.
   * Used when creating new categories at the same time
   * that a new task is added.
   * The task is in charge of updating the whole option
   * object.
   */
  addCategoryToLocalOptions(category){
    let dbCat = category.categoryToDbObject();
    _categories.push(dbCat);
  }



  async promiseToAddCategory(category){
    let dbCat = category.categoryToDbObject();
    return addCategoryToDb(dbCat);
  }


  /**
   * Updates an existing category with the new
   * category object received, updates the database
   * and exectures the callback.
   */
  updateCategory(category, callback){
    _categories = _categories.map((cat) => {
      if(cat._id == category.id){
        cat.title = category.title;
        cat.color = category.color;
        cat.description = category.description;
        cat.completedTaskNb = category.completedTaskNb;
        cat.totalTaskNb = category.totalTaskNb;
      }
      return cat;
    });
    updateDatabase(callback);
  }


  /**
   * Saves this object category array data
   * into the database.
   */
  saveCategories(categories){
    _categories = categories;
    updateDatabase();
  }


  /**
   * Removes one id from the categorry array
   * object and updates the database.
   */
  removeCategoryById(id){
    let index = _categories.map(x => {
      return x._id;
    }).indexOf(id);
    _categories.splice(index, 1);
    updateDatabase();
  }
};


/**
 * Patches data into database and executes callback
 * when there is one.
 */
function updateDatabase(callback){
  const getCatsBack = _db.updateOptions(_userId, {categories: _categories});

  getCatsBack.done((dbCats) => {
    _categories = dbCats.options.categories;
    if (callback != undefined){
      callback();
    }

  }).fail((err) => {
    _messanger.showMsgBox('An error occurred when saving the category data.\nPlease refresh the page and try again.','error','down');
    console.log(err);
  });
}

async function addCategoryToDb(category) {
  return _db.addCategory(_userId, category);
}
