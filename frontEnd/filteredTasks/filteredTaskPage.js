const FilteredTaskListView = require('./filteredTaskListView');
// const AddProjectForm = require('./../addProject_form');
const Page = require('./../pages/page');

/**
 * Page where users can filter the type of task they want to display.
 * TODO: more detailed description.
 */
 class FilteredTaskPage extends Page{
   constructor(){
   super();

   this.pageName = 'FilteredTasks';

   // Top bar buttons
   this.filtersBtn = {
     id: '',
     text:'Filters',
     action: function(){
         alert('Quick stats: coming soon!');}};
   this._topBarBtns = [this.filtersBtn];

   // Title
   this._pageTitle = 'Tasks';

   // Methods
   this.actions = {
     // removeItem: (id) => {this.removeListItem(id);},
     // reactivateItem: (id) => {this.reactivateItem(id);},
     refreshPage: (pageNb) => {this._showPage(pageNb);}
    };
   }

   //TODO: write docs
   async show(renderQuery = undefined, searchQuery = undefined){

     // Save reference to query (used when loading other pages)
     this.searchQuery = searchQuery;

     this.updateLocalStorage();

     this.listView = new FilteredTaskListView(this.actions, this);
     this.taskList = await this.listView.getList(searchQuery);
     this.pageBtns = this.listView.getPagingBtns(this.listView.pageCnt, searchQuery.pageNb, this.actions.refreshPage);

     // Don't do anything if a different page is active.
     if(!this._pageIsOpen(this)) return;

     // Resets and clears page container
     this.setPage();

     // Scrolls when necessary
     this._scrollPage(renderQuery);

     // Remember page number
     this.currentPage = (searchQuery!=undefined) ? searchQuery.pageNb : 1;

     // Insert contents
     this._Editor.insertContents(this.taskList);
     this._Editor.insertContents(this.pageBtns);

     // Applies fadeIn effect when necessary

     this._fadeIn(renderQuery);

     // Display msg
     this._displayMsg(renderQuery);
   }

   _showPage(pageNb){
      this.searchQuery.pageNb = pageNb;
      let renderQuery = {fadeIn: false, scrollToTop: true};
      this.show(renderQuery, this.searchQuery);
   }



   /**
    * Removes existing elements in the editor and editor
    * top bar and appends complete project list view.
    */
   // showPage(pageNb){
   //   this.updateLocalStorage();
   //   let hasFadeIn = false;
   //   let scrollsToTop = true;
   //   showPage(this, hasFadeIn, pageNb, scrollsToTop);
   //  }


     /**
      * Shows page without scrolling or any fade effect.
      * Used for when removing items from a view and
      * refreshing that view.
      */
    // showPageWithNoScroll(pageNb, msg){
    //   this.updateLocalStorage();
    //   let hasFadeIn = false;
    //   let scrollsToTop = false;
    //   showPage(this, hasFadeIn, pageNb, scrollsToTop, msg);
    //  }

   /**
    * Shows page with a fade in effect.
    */
   // showPageWhFadeIn(pageNb){
   //   this.updateLocalStorage();
   //   let hasFadeIn = true;
   //   let scrollsToTop = true;
   //   showPage(this, hasFadeIn, pageNb, scrollsToTop);
   // }

   /**
    * Removes the selected project from the database,
    * and refreshes the page.
    */
   // removeListItem(id){
   //   let msg = 'Project removed';
   //   let callback = () => {this.showPageWithNoScroll(this.currentPage, msg);};
   //   OPTIONS.projects.removeCompleteProjectById(id, callback);
   // }


   /**
    * Removes the selected project from the database,
    * and refreshes the page.
    */
   // reactivateItem(id){
   //   let msg = 'Project reactivated';
   //   let callback = () => {this.showPageWithNoScroll(this.currentPage, msg);};
   //   OPTIONS.projects.reactivateProjectById(id, callback);
   // }

 }

 module.exports = new FilteredTaskPage();
