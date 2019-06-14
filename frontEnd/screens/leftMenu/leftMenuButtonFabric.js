/*jshint esversion: 6 */
const categoriesPage = require('./../../categories/CategoryPage');
const projectsPage = require('./../../projects/projectPage');
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
        icon: icons.star(),
        fun: () => {
          mobileMenu.hide();
          activeTaskPage.showPageWithFadeIn();
        }
      },
     pending : {
       text: 'Pending',
       icon: icons.star(),
       fun: () => {
         mobileMenu.hide();
         alert('Pending tasks!');
       }
     },
     complete : {
       text: 'Complete',
       icon: icons.star(),
       fun: () => {
         mobileMenu.hide();
         alert('Complete tasks!');
       }
     }
   };

  }

  addTopButtons(){
    list = getTopButtonList(this.topButtons);
    container = $('<div>',{});
    container.append(list);
    buttonHolder.append(container);
  }

  addEventsToTopBtns(){
    setActiveBtn();
    setPendingBtn();
    setCompleteBtn();
  }

  addEventsToMiddleBtns(){
    setProjectBtn();
    setCategoryBtn();
    setRememberBtn();
    setLearningBtn();
    setListBtn();
  }

};



function getTopButtonList(btns) {

  let list = $('<ul>',{id:'left_menu_main_filters'});
}

function setActiveBtn(){
  const btn = $('#btn_filter_active');
  btn.on('click', function(){
      mobileMenu.hide();
      activeTaskPage.showPageWithFadeIn();
  });
}

function setPendingBtn(){
  const btn = $('#btn_filter_pending');
  btn.on('click', function(){
      mobileMenu.hide();
      alert('Pending tasks!');
  });
}

function setCompleteBtn(){
  const btn = $('#btn_filter_complete');
  btn.on('click', function(){
      mobileMenu.hide();
      alert('Complete tasks!');
  });
}



function setProjectBtn(){
  const btn = $('#btn_projects');
  btn.on('click', function(){
      mobileMenu.hide();
      projectsPage.showPageWhFadeIn();
  });

  const addBtn= $('#btn_projects_plus');
  addBtn.on('click', function(){
      mobileMenu.hide();
      projectsPage.showAddProjectForm();
  });
}

function setCategoryBtn(){
  const btn = $('#btn_categories');
  btn.on('click', function(){
    mobileMenu.hide();
    categoriesPage.showPageWhFadeIn();
  });

  const addBtn= $('#btn_categories_plus');
  addBtn.on('click', function(){
    mobileMenu.hide();
    categoriesPage.showAddCategoryForm();
  });
}

function setRememberBtn(){
  const btn = $('#btn_toRemember');
  btn.on('click', function(){
    mobileMenu.hide();
    alert('Remember!');
  });

  const addBtn= $('#btn_toRemeber_plus');
  addBtn.on('click', function(){
    mobileMenu.hide();
    alert('Add reminders!');
  });
}

function setLearningBtn(){
  const btn = $('#btn_learnings');
  btn.on('click', function(){
    mobileMenu.hide();
    alert('Learnings!');
  });

  const addBtn= $('#btn_learnings_plus');
  addBtn.on('click', function(){
    mobileMenu.hide();
    alert('Add learnings!');
  });
}

function setListBtn(){
  const btn = $('#btn_lists');
  btn.on('click', function(){
    mobileMenu.hide();
    alert('Lists!');
  });

  const addBtn= $('#btn_lists_plus');
  addBtn.on('click', function(){
    mobileMenu.hide();
    alert('Add list!');
  });
}
