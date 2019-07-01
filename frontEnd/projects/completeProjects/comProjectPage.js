/*jshint esversion: 6 */
const OPTIONS = require('./../../optionHandler/OptionHandler');
const CompleteProjectListView = require('./comProjectListView');
const AddProjectForm = require('./../addProject_form');
const Page = require('./../../pages/page');

/**
 * A page used to display only complete projects. These complete projects
 * can be removed, but cannot be edited in any way.
 * The page also has buttons for adding new projects, or displaying active
 * projects back.
 */


 class CompleteProjectsPage extends Page{
   constructor(){
   super();

   this.pageName = 'CompleteProject';

   //Buttons:
   this.addProjBtn = {
     id: 'topBar_addProj_btn',
     text:'Add project',
     action: () =>{
       let addProjForm = new AddProjectForm(this.activePage);
       addProjForm.displayForm();
       }
     };
   this.activeProjBtn = {
     id: 'topBar_addProj_btn',
     text:'Active',
     action: () => {
       this.activePage.showPageWhFadeIn();}
     };

   this._topBarBtns = [this.addProjBtn,
                      this.activeProjBtn];
   this._pageTitle = 'Completed projects';
   this.actions = {
     removeItem: (id) => {this.removeListItem(id);},
     reactivateItem: (id) => {this.reactivateItem(id);},
     refreshPage: (pageNb) => {this.showPageWhFadeIn(pageNb);}
    };
   }


   /**
    * So actions from the top bar buttons can
    * interact with the active project page, first we
    * need to load the reference to that page.
    */
   loadActivePageRef(activePage){
     this.activePage = activePage;
   }



   /**
    * Removes existing elements in the editor and editor
    * top bar and appends complete project list view.
    */
   showPage(pageNb){
     this.updateLocalStorage();
     let hasFadeIn = false;
     let scrollsToTop = true;
     showPage(this, hasFadeIn, pageNb, scrollsToTop);
    }


     /**
      * Shows page without scrolling or any fade effect.
      * Used for when removing items from a view and
      * refreshing that view.
      */
    showPageWithNoScroll(pageNb, msg){
      this.updateLocalStorage();
      let hasFadeIn = false;
      let scrollsToTop = false;
      showPage(this, hasFadeIn, pageNb, scrollsToTop, msg);
     }

   /**
    * Shows page with a fade in effect.
    */
   showPageWhFadeIn(pageNb){
     this.updateLocalStorage();
     let hasFadeIn = true;
     let scrollsToTop = true;
     showPage(this, hasFadeIn, pageNb, scrollsToTop);
   }

   /**
    * Removes the selected project from the database,
    * and refreshes the page.
    */
   removeListItem(id){
     let msg = 'Project removed';
     let callback = () => {this.showPageWithNoScroll(this.currentPage, msg);};
     OPTIONS.projects.removeCompleteProjectById(id, callback);
   }


   /**
    * Removes the selected project from the database,
    * and refreshes the page.
    */
   reactivateItem(id){
     let msg = 'Project reactivated';
     let callback = () => {this.showPageWithNoScroll(this.currentPage, msg);};
     OPTIONS.projects.reactivateProjectById(id, callback);

   }

 }


function showPage(page, hasFadeIn, pageNb, scrollsToTop, msg) {

  let callback = (projectList, pagBtns) => {
    
    // So the page only gets injected when it is the currently selected page.
    let currentPage = localStorage.getItem('currentPage');
    if (currentPage == page.pageName){

      // Resets page container
      page.setPage();
      if (scrollsToTop){page.scrollPageToTop();}

      // So when we remove an item from the list, the
      // showPage method knows which method to show.
      page.currentPage = pageNb;

      // Insert contents
      page._Editor.insertContents(projectList);
      page._Editor.insertContents(pagBtns);

      //Apply fade in
      if (hasFadeIn){page.listView.fadeInList();}

      // Display msg
      if (msg != undefined){page.messanger.showMsgBox(msg,'goal','down');}
    }
  };

  page.listView = new CompleteProjectListView(page.actions);
  page.listView.getList(callback, pageNb);
}




 module.exports = new CompleteProjectsPage();
