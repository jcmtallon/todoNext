/*jshint esversion: 6 */

/**
 * @module
 * TODO
 */

 let leftMenu;
 let app;
 let leftMenuIcon;

module.exports = class MobileLeftMenu{
  constructor(){
    leftMenu = $("#left_menu");
    app = $("#content");
    leftMenuIcon = $("#top_bar_menu_icon");
  }


  /**
   * Removes mobile left menu when screen is enlarged to PC size.
   */
  setWindowResizeEvent(){
    $( window ).resize(function() {
     if($( window ).width()>950 &&  leftMenu.hasClass("show_left_menu")){
       hideMenu();
     }
    });
  }


  /**
   * Adds click functionality to passed element.
   */
  setMenuBtnClickEvent(elementId){
    let leftMenuBtn = $('#' + elementId);
    leftMenuBtn.on('click', function(){
      if ($( window ).width()<950){
        if(leftMenu.hasClass("show_left_menu")){
          hideMenu();
        }else{
          showMenu();
        }
      }
    });
  }


  /**
   * Hides left menu when displayed in mobile version.
   */
  hide(){
    if($( window ).width()<=950 &&  leftMenu.hasClass("show_left_menu")){
      hideMenu();
    }
  }
};

function hideMenu(){
  leftMenu.removeClass("show_left_menu");
  app.removeClass("grey_content");
  leftMenuIcon.attr("src", "/assets/btn_topbar_menuicon.svg");

}

function showMenu(){
  app.addClass("grey_content");
  leftMenu.addClass("show_left_menu");
  leftMenuIcon.attr("src", "/assets/btn_top_close_menu.svg");
  setCloseEvents();
}

/**
 * Adds click event so the menu is removed from
 * the screen when the user clicks outside the menu.
 */
function setCloseEvents() {
  $(document).click((e) =>{
    if(e.target.tagName == 'HTML'){
      $(document).off('click');
      hideMenu();
    }
  });
}
