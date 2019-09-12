/*jshint esversion: 9 */
const EventEmitter = require('events');
const Category = require('./../categories/Category.js');
const DbHandler = require('./../DbHandler/DbHandler');
const MsgBox = require('./../messageBox/messageBox');

 let _db;
 let _userId;
 let _categories;
 let _messanger;

module.exports = class Categories extends EventEmitter{
  constructor(categories, userId){
    super();
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

  /**
   * Get number of elements in the array.
   */
  getNbOfItems(){
    return _categories.length;
  }

  setCategories(categories){
    _categories = categories;
  }

  /**
   * Returns color attribute of the
   * specified category.
   */
  getColorById(id){

    let cat = _categories.find (obj => {
      return obj._id == id;
    });

    let color = (cat!=undefined) ? cat.color: '#263e65';
    return color;
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
   * Returns category name for specified id. 
   */
  getCategoryNameById(id){
    let dbCat = _categories.find (obj => {return obj._id == id;});
    if (dbCat != undefined){
      return dbCat.title;
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
    this.emit('updateScreen');
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




  /**
   * Transform category object into db category object,
   * pushes the category into the database and returns
   * the new db object that includes the new id inside.
   */
  async promiseToAddCategory(category){
    const dbCat = category.categoryToDbObject();
    const updatedUser = await addCategoryToDb(dbCat);
    _categories = updatedUser.options.categories;

    return _categories[_categories.length-1];
  }


  /**
   * Updates an existing category with the new
   * category object received, updates the database
   */
  updateCategory(category){
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
  }


  /**
   * Updates the database categories array with
   * the local categorry array info.
   */
  updateDb(){
    this.emit('updateScreen');
    return _db.updateOptions(_userId, {categories: _categories});
    }


  /**
   * Saves this object category array data
   * into the database.
   */
  saveCategories(categories){
    _categories = categories;
    this.emit('updateScreen');
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
    this.emit('updateScreen');
    updateDatabase();
  }

  // ----------------- Counters ------------------//

   /**
    * Adds one unit to the totalTaskNb attribute
    * of each category with an id that matches
    * any of the categoryIds in the passed tasks.
    *
    * @param  {Array} tasks array of task objects
    */
   addToCounters(tasks){
     $.each(tasks,(index, task) => {
       _categories = _categories.map((cat) => {
         if(cat._id == task.categoryId){
            cat.totalTaskNb++;
         }
         return cat;
       });
     });
   }


   /**
    * Sums passed value to the specified category
    * total counter attribute.
    */
   increaseCounterBy(value, id){
       _categories = _categories.map((cat) => {
         if(cat._id == id){
            cat.totalTaskNb = cat.totalTaskNb + value;
         }
         return cat;
       });
   }

   /**
    * Adds one unit to the completedTaskNb attribute
    * of each category with an id that matches
    * any of the categoryIds in the passed tasks.
    *
    * @param  {Array} tasks array of task objects
    */
   addToComplete(tasks){
     $.each(tasks,(index, task) => {
       _categories = _categories.map((cat) => {
         if(cat._id == task.categoryId){
            cat.completedTaskNb++;
         }
         return cat;
       });
     });
   }

   /**
    * Rests one unit to the totalTaskNb attribute
    * of each category with an id that matches
    * any of the categoryIds in the passed tasks.
    *
    * @param  {Array} tasks array of task objects
    */
   restFromCounters(tasks){
     $.each(tasks,(index, task) => {
       _categories = _categories.map((cat) => {
         if(cat._id == task.categoryId){
            cat.totalTaskNb--;
         }
         return cat;
       });
     });
   }

   /**
    * Rests passed value to the specified category
    * total counter attribute.
    */
   reduceCounterBy(value, id){
       _categories = _categories.map((cat) => {
         if(cat._id == id){
            cat.totalTaskNb = cat.totalTaskNb - value;
         }
         return cat;
       });
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



/**
 * Pushes new category into option object category array
 * in the database.
 * Returns a promise with all the user option data.
 */
async function addCategoryToDb(category) {
  return _db.addCategory(_userId, category);
}
