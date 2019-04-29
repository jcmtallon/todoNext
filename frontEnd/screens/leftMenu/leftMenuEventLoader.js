/*jshint esversion: 6 */
const categoryPage = require('./../../categories/CategoryPage');
const activeTodoPage = require('./../../activeTodoList/activeTodoPage');
const MobileLeftMenu  = require('./mobileLeftMenu');

/**
 * LeftMenuEventLoader. Class in charge of loading the different click events
 * for all the links/buttons in the left menu.
 */

 let menu;

module.exports = class LeftMenuEventLoader{
  constructor(){
    menu = new MobileLeftMenu();
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

function setActiveBtn(){
  const btn = $('#btn_filter_active');
  btn.on('click', function(){
      menu.hide();
      activeTodoPage.showPageWithFadeIn();
  });
}

function setPendingBtn(){
  const btn = $('#btn_filter_pending');
  btn.on('click', function(){
      menu.hide();
      alert('Pending tasks!');
  });
}

function setCompleteBtn(){
  const btn = $('#btn_filter_complete');
  btn.on('click', function(){
      menu.hide();
      alert('Complete tasks!');
  });
}



function setProjectBtn(){
  const btn = $('#btn_projects');
  btn.on('click', function(){
      menu.hide();
      alert('Projects!');
  });

  const addBtn= $('#btn_projects_plus');
  addBtn.on('click', function(){
      menu.hide();
      alert('Add projects!');
  });
}

function setCategoryBtn(){
  const btn = $('#btn_categories');
  btn.on('click', function(){
    menu.hide();
    categoryPage.showPage();
  });

  const addBtn= $('#btn_categories_plus');
  addBtn.on('click', function(){
    menu.hide();
    alert('Add categories!');
  });
}

function setRememberBtn(){
  const btn = $('#btn_toRemember');
  btn.on('click', function(){
    menu.hide();
    alert('Remember!');
  });

  const addBtn= $('#btn_toRemeber_plus');
  addBtn.on('click', function(){
    menu.hide();
    alert('Add reminders!');
  });
}

function setLearningBtn(){
  const btn = $('#btn_learnings');
  btn.on('click', function(){
    menu.hide();
    alert('Learnings!');
  });

  const addBtn= $('#btn_learnings_plus');
  addBtn.on('click', function(){
    menu.hide();
    alert('Add learnings!');
  });
}

function setListBtn(){
  const btn = $('#btn_lists');
  btn.on('click', function(){
    menu.hide();
    alert('Lists!');
  });

  const addBtn= $('#btn_lists_plus');
  addBtn.on('click', function(){
    menu.hide();
    alert('Add list!');
  });
}
