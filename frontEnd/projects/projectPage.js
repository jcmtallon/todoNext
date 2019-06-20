/*jshint esversion: 9 */
const OPTIONS = require('./../optionHandler/OptionHandler');
const ProjectListView = require('./projectListView');
const AddProjectForm = require('./addProject_form');
const Page = require('./../pages/page');
const MsgBox = require('./../messageBox/messageBox');
const completedProjectsPage = require('./completeProjects/comProjectPage');

/**
 * Represents the page where the user can introduce new projects,
 * remove and edit the existing ones. Consists of some top bar
 * buttons, a page title and a list of the existing categories.
 */


 class ProjectsPage extends Page{
   constructor(){
   super();

   this.pageName = 'projects';

   // So Complete page can refer to this page later.
   completedProjectsPage.loadActivePageRef(this);

   // So this page can display messages.
   this._messanger = new MsgBox();

   //Buttons:
   this.addProjBtn = {
     id: 'topBar_addProj_btn',
     text:'Add project',
     action: () =>{
       let addProjForm = new AddProjectForm(this);
       addProjForm.displayForm();
       }
     };
   this.completeProjBtn = {
     id: 'topBar_addProj_btn',
     text:'Complete',
     action: function(){
       completedProjectsPage.showPageWhFadeIn();}
     };

   this._topBarBtns = [this.addProjBtn,
                      this.completeProjBtn];
   this._pageTitle = 'Projects';
   this.actions = {
     removeItem: (id) => {this.removeListItem(id);},
     editItem: (id) => {this.displayEditListItemForm(id);},
     completeItem: (id) => {this.completeItem(id);}
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
     this.listView = new ProjectListView(this.actions);
     let projectList = this.listView.getList();
     this._Editor.insertContents(projectList);
     }

     /**
      * Shows page with a fade in effect.
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
      * Displays add project form in the app.
      */
     showAddProjectForm(){
       let addProjForm = new AddProjectForm(this);
       addProjForm.displayForm();
     }

     /**
      * Takes a project object, adds it to the user options
      * and refresh the page project list with the latest
      * project data.
      */
     addNewProject(project){
       const callBack = () => {this.showPageWhHightlight();};
       OPTIONS.projects.addProject(project, callBack);
     }

     /**
      * Updates target option with new input data, both locally
      * and in the database.
      * If new data category changed, requests that all active todos
      * with the same project id renew their categoryId value.
      */
     async updateProject(project){

       let projBackup = OPTIONS.projects.getProjectById(project.id);
       OPTIONS.projects.updateProject(project);
       this.showPage();

       try{
         await OPTIONS.projects.updateDb();

         // If project category changed, update category id info of
         // all the active tasks with this project assigned.
         if(projBackup.categoryId != project.categoryId){
           let actTskBUp = OPTIONS.activeTasks.getActiveTaskCopy();
           OPTIONS.activeTasks.updateActiveTasksWithProject(project);
           await OPTIONS.activeTasks.updateDb();
         }

       }catch(err){
         this._messanger.showMsgBox('Failed to update project data. Please refresh the page and try again.','error','down');
         console.log(err);
         OPTIONS.projects.updateProject(projBackup);
         this.showPageWhFadeIn();

         // If category changed, we save project backup data into the db,
         // in case this part of the procedure had been completed.
         // We also match the local active task array with the task backup.
         if(projBackup.categoryId != project.categoryId){
           OPTIONS.projects.updateDb();
           OPTIONS.activeTasks.setActiveTasks(actTskBUp);
         }
       }
     }

     /**
      * Removes the selected project from the option project array,
      * and form the database collection and
      * refreshes the page.
      */
     removeListItem(id){
       let callback = () => {this.showPage();};
       OPTIONS.projects.removeProjectById(id, callback);
     }

     /**
      * Displays addProjectForm already populated with the
      * information from the passed project.
      */
     displayEditListItemForm(id){
       let targetProj = OPTIONS.projects.getProjectById(id);
       let addProjectForm = new AddProjectForm(this, targetProj);
       addProjectForm.displayForm();
     }


     /**
      * Removes project from active project array and adds it
      * to the complete project collection. Then displays the
      * updated list.
      */
     completeItem(id){
       let callback = () => {
         this.showPage();
         this._messanger.showMsgBox('Project completed!','goal','down');
       };
       let proj = OPTIONS.projects.getProjectById(id);

       if (proj.totalTaskNb == 0){
         this._messanger.showMsgBox('Cannot complete\na project with no tasks.','error','down');
         return;
       }

       if (proj.completedTaskNb >= proj.totalTaskNb){
         OPTIONS.projects.completeProject(proj, callback);
       }else{
        this._messanger.showMsgBox('Complete all\nproject tasks first.','error','down');
       }
     }

 }

 module.exports = new ProjectsPage();
