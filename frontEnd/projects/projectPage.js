/*jshint esversion: 6 */
const Page = require('./../pages/page');

/**
 * Represents the page where the user can introduce new projects,
 * remove and edit the existing ones. Consists of some top bar
 * buttons, a page title and a list of the existing categories.
 */

 const listContainerID = 'projectListView';

 const addProjectBtn = {
   id: 'topBar_addProj_btn',
   text:'Add project',
   action: function(){
       alert('Add projects: Cooming soon!');}
 };

 class ProjectsPage extends Page{
   constructor(){
   super();
   }


   /**
    * Removes existing elements in the editor and editor
    * top bar and appends project page elements.
    */
   showPage(){
     this.removeCurrentPage();
     this._EditorTopBar.addButon(addProjectBtn);
     this._Editor.setTitle('Projects');
     this._Editor.insertPageContainer(createPageContainer());
     }

     showAddProjectForm(){
       alert('Add project: coming soon!');
     }
 }


 function createPageContainer(){
   let ol = $('<ol>', {
     id:listContainerID,
     tabindex:'0',
     class: 'stdListContainer'});
   return ol;
 }

 module.exports = new ProjectsPage();
