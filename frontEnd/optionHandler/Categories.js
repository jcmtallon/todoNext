/*jshint esversion: 6 */
const Category = require('./../categories/Category.js');
const DbHandler = require('./../DbHandler/DbHandler');

 let _db;
 let _userId;
 let _categories;

module.exports = class Categories{
  constructor(categories, userId){
    _categories = categories;
    _userId = userId;
    _db = new DbHandler();
  }

  getCategories(){
    return _categories;
  }

  saveCategories(categories){
    _categories = categories;
    updateDatabase();
  }
};


/**
 * Patches data into database.
 */
function updateDatabase(){
    _db.updateOptions(_userId, {categories: _categories});
}
