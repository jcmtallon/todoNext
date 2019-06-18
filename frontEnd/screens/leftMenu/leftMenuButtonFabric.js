/*jshint esversion: 6 */
const categoriesPage = require('./../../categories/CategoryPage');
const projectsPage = require('./../../projects/projectPage');
const habitPage = require('./../../habits/habitPage');
const activeTaskPage = require('./../../activeTodos/activeTaskPage');
const MobileLeftMenu  = require('./mobileLeftMenu');
const icons = require('./../../icons/icons');

/**
 * LeftMenuEventLoader. Class in charge of loading the different click events
 * for all the links/buttons in the left menu.
 */

 let mobileMenu;
 let buttonHolder;

module.exports = class LeftMenuButtonFabric{
  constructor(){
    mobileMenu = new MobileLeftMenu();
    buttonHolder = $('#left_menu_buttons_holder');

    this.topButtons ={
      active : {
        text: 'Active',
        icon: icons.activeTasks('#515151'),
        fun: () => {
          mobileMenu.hide();
          activeTaskPage.showPageWithFadeIn();
        }
      },
     pending : {
       text: 'Pending',
       icon: icons.PendingTasks('#515151'),
       fun: () => {
         mobileMenu.hide();
         alert('Pending tasks!');
       }
     },
     complete : {
       text: 'Complete',
       icon: icons.completeTasks('#515151'),
       fun: () => {
         mobileMenu.hide();
         alert('Complete tasks!');
       }
     }
   };


   this.middleButtons ={
     habits : {
       text: 'Habits',
       icon: icons.habits('#515151'),
       fun: () => {
         mobileMenu.hide();
         habitPage.showPageWhFadeIn();
       },
       add: () => {
         mobileMenu.hide();
        habitPage.showAddHabitForm();
       }
     },
     projects : {
       text: 'Projects',
       icon: icons.projectsThin('#515151'),
       fun: () => {
         mobileMenu.hide();
         projectsPage.showPageWhFadeIn();
       },
       add: () => {
         mobileMenu.hide();
         projectsPage.showAddProjectForm();
       }
     },
     categories : {
       text: 'Categories',
       icon: icons.categoriesThin('#515151'),
       fun: () => {
         mobileMenu.hide();
         categoriesPage.showPageWhFadeIn();
       },
       add: () => {
         mobileMenu.hide();
         categoriesPage.showAddCategoryForm();
       }
     },
     toRemember : {
       text: 'To Remember',
       icon: icons.toRemember('#515151'),
       fun: () => {
         mobileMenu.hide();
         alert('coming soon remember!');
       },
       add: () => {
         mobileMenu.hide();
         alert('coming soon: remember add!');
       }
     },
     learnings : {
       text: 'Learnt',
       icon: icons.learning('#515151'),
       fun: () => {
         mobileMenu.hide();
         alert('coming soon: learnt!');
       },
       add: () => {
         mobileMenu.hide();
         alert('coming soon: add learnt!');
       }
     },
     lists : {
       text: 'Lists',
       icon: icons.lists('#515151'),
       fun: () => {
         mobileMenu.hide();
         alert('coming soon: lists!');
       },
       add: () => {
         mobileMenu.hide();
         alert('coming soon: lists!');
       }
     }
  };

  this.lists ={
    list1 : {
      text: 'Games to play',
      icon: icons.listBullet('#515151'),
      fun: () => {
        mobileMenu.hide();
        alert('Under construction!');
      },
      add: () => {
        mobileMenu.hide();
        alert('Under construction!');
      }
      },
      list2 : {
        text: 'Ideas',
        icon: icons.listBullet('#515151'),
        fun: () => {
          mobileMenu.hide();
          alert('Under construction!');
        },
        add: () => {
          mobileMenu.hide();
          alert('Under construction!');
        }
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
  counter = $('<small>',{text:'0'});
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
  counter = $('<small>',{text:'0'});
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
