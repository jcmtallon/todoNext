/*jshint esversion: 6 */
const categoriesPage = require('./../../categories/CategoryPage');
const projectsPage = require('./../../projects/projectPage');
const habitPage = require('./../../habits/habitPage');
const activeTaskPage = require('./../../activeTodos/activeTaskPage');
const filteredTaskPage = require('./../../filteredTasks/filteredTaskPage');
const icons = require('./../../icons/icons');
const MobileLeftMenu  = require('./mobileLeftMenu');

/**
 * LeftMenuEventLoader. Class in charge of loading the different click events
 * for all the links/buttons in the left menu.
 */

 let mobileMenu;
 let buttonHolder;

module.exports = class LeftMenuButtonFabric{
  constructor(counterIds){
    mobileMenu = new MobileLeftMenu();
    buttonHolder = $('#left_menu_buttons_holder');

    this.topButtons ={

      active : {
        text: 'Active',
        icon: icons.activeTasks('#515151'),
        fun: () => {
          mobileMenu.hide();
          activeTaskPage.checkHabits();
          activeTaskPage.showPageWithFadeIn();
        },
        counterId: counterIds.active
      },

     pending : {
       text: 'Pending',
       icon: icons.PendingTasks('#515151'),
       fun: () => {
         mobileMenu.hide();
         const renderQuery = {fadeIn: true,
                              scrollToTop: true};
         const searchQuery = {pageNb: 1,
                              status: 'pending'};
         filteredTaskPage.show(renderQuery, searchQuery);
       },
       counterId: counterIds.pending
     },

     complete : {
       text: 'Complete',
       icon: icons.completeTasks('#515151'),
       fun: () => {
         mobileMenu.hide();
         const renderQuery = {fadeIn: true,
                              scrollToTop: true};
        const searchQuery = {pageNb: 1,
                             status: 'complete'};
         filteredTaskPage.show(renderQuery, searchQuery);
       },
       counterId: counterIds.complete
     }
   };


    this.middleButtons ={
     habits : {
       isActive: true,
       text: 'Habits',
       icon: icons.habits('#515151'),
       fun: () => {
         mobileMenu.hide();
         habitPage.showPageWhFadeIn();
       },
       add: () => {
         mobileMenu.hide();
        habitPage.showAddHabitForm();
       },
       counterId: counterIds.habits
     },

     projects : {
       isActive: true,
       text: 'Projects',
       icon: icons.projectsThin('#515151'),
       fun: () => {
         mobileMenu.hide();
         projectsPage.showPageWhFadeIn();
       },
       add: () => {
         mobileMenu.hide();
         projectsPage.showAddProjectForm();
       },
       counterId: counterIds.projects
     },

     categories : {
       isActive: true,
       text: 'Categories',
       icon: icons.categoriesThin('#515151'),
       fun: () => {
         mobileMenu.hide();
         categoriesPage.showPageWhFadeIn();
       },
       add: () => {
         mobileMenu.hide();
         categoriesPage.showAddCategoryForm();
       },
       counterId: counterIds.categories
     },

     toRemember : {
       isActive: false,
       text: 'To Remember',
       icon: icons.toRemember('#797979'),
       fun: () => {
         mobileMenu.hide();
         alert('Coming soon!');
       },
       add: () => {
         mobileMenu.hide();
         alert('Coming soon!');
       },
       counterId: counterIds.toRemember
     },

     learnings : {
       isActive: false,
       text: 'Learnt',
       icon: icons.learning('#797979'),
       fun: () => {
         mobileMenu.hide();
         alert('Coming soon!');
       },
       add: () => {
         mobileMenu.hide();
         alert('Coming soon!');
       },
       counterId: counterIds.learnings
     },

     lists : {
       isActive: false,
       text: 'Lists',
       icon: icons.lists('#797979'),
       fun: () => {
         mobileMenu.hide();
         alert('Coming soon!');
       },
       add: () => {
         mobileMenu.hide();
         alert('Coming soon!');
       },
       counterId: counterIds.lists
     }
  };


    this.lists ={

    list1 : {
      isActive: false,
      text: 'Games to play',
      icon: icons.listBullet('#797979'),
      fun: () => {
        mobileMenu.hide();
        alert('Coming soon!');
      },
      add: () => {
        mobileMenu.hide();
        alert('Coming soon!');
      },
      counterId: counterIds.list1
      },

      list2 : {
        isActive: false,
        text: 'Ideas',
        icon: icons.listBullet('#797979'),
        fun: () => {
          mobileMenu.hide();
          alert('Coming soon!');
        },
        add: () => {
          mobileMenu.hide();
          alert('Coming soon!');
        },
        counterId: counterIds.list2
      },
    };
  }

  /**
   * Adds Active tasks, pending tasks and
   * complete tasks buttons to the left
   * menu button holder element.
   */
  addTopButtons(){
    let list = getTopButtonList(this.topButtons);
    let container = $('<div>',{});
    container.append(list);
    buttonHolder.append(container);
  }

  /**
   * Adds habits, categories, projects, learnings,
   * to remember, lists buttons to the left
   * menu button holder element.
   */
  addMiddlebuttons(){
    let list = getMiddleButtonList(this.middleButtons);
    let container = $('<div>',{});
    container.append(list);
    buttonHolder.append(container);
  }

  /**
   * Adds list buttons to the left
   * menu button holder element.
   */
  addListButtons(){
    let list = getListButtons(this.lists);
    let container = $('<div>',{});
    container.append(list);
    buttonHolder.append(container);
  }
};


//-------- Top buttons ----------------//

function getTopButtonList(btns) {
  let list = $('<ul>',{id:'left_menu_main_filters'});
  $.each(btns,(name, btn) =>{
    list.append(buildTopButton(btn));
  });
  return list;
}

function buildTopButton(btn) {

  let icon = btn.icon;
  icon.addClass('left_menu_btn');

  let iconSpan;
  iconSpan = $('<span>',{class:'item_icon'});
  iconSpan.append(icon);

  let counter;
  counter = $('<small>',{id: btn.counterId});
  counter.css({'color':'#263e65',
                'margin-left':'6px'});

  let labelSpan;
  labelSpan = $('<span>',{
    class: 'item_content',
    text:btn.text});

  let item;
  item = $('<li>',{class:'main_filter_btn'});
  item.append(iconSpan).append(labelSpan).append(counter);
  item.on('click', function(){btn.fun();});
  return item;
}

//-------- Middle buttons ----------------//

function getMiddleButtonList(btns) {
  let list = $('<ul>',{id:'left_menu_sections'});
  $.each(btns,(name, btn) =>{
    list.append(buildMiddleButtons(btn));
  });
  return list;
}


function buildMiddleButtons(btn) {

  let icon = btn.icon;
  icon.addClass('left_menu_btn');

  let iconSpan;
  iconSpan = $('<span>',{class:'item_icon'});
  iconSpan.append(icon);

  let labelSpan;
  labelSpan = $('<span>',{
    class: 'item_content',
    text: btn.text});


  let counter;
  counter = $('<small>',{id: btn.counterId});
  counter.css({'color':'#263e65',
                'margin-left':'6px'});

  let leftPart;
  leftPart = $('<div>',{class:'section_item_left'});
  leftPart.append(iconSpan).append(labelSpan).append(counter);
  leftPart.on('click', function(){btn.fun();});

  let rightPart;
  rightPart = $('<div>',{
    class:'section_item_right',
    text: '+'});
  rightPart.on('click', function(){btn.add();});

  if(!btn.isActive) {
    labelSpan.css('color', '#797979');
    counter.css('color', '#797979');
    rightPart.css('color', '#797979');
  }

  let item;
  item = $('<li>',{class:'menu_section_item'});
  item.append(leftPart).append(rightPart);
  return item;
}


//-------- List buttons ----------------//

function getListButtons(btns) {
  let list = $('<ul>',{id:'left_menu_sections'});
  $.each(btns,(name, btn) =>{
    list.append(buildMiddleButtons(btn));
  });
  return list;
}
