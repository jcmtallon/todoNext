/*jshint esversion: 6 */

/**
 * @Module
 * In charge of displaying and hidding the main left menu.
 */

//User interface elements
const leftMenuIconHolder = $('#top_bar_menu_icon_container');
const leftMenu = $("#left_menu");
const content = $("#content");
const leftMenuIcon = $("#top_bar_menu_icon");


//Shows and hides left menu in mobile version.
leftMenuIconHolder.on('click', function(){
  if ($( window ).width()<950){
    if(leftMenu.hasClass("show_left_menu")){
      leftMenuHide(leftMenu,content,leftMenuIcon);
    }else{
      leftMenuShow(content,leftMenu,leftMenuIcon);
    }
  }
});


//Removes mobile left menu when screen is enlarged to PC size.
$( window ).resize(function() {
 if($( window ).width()>950 &&  leftMenu.hasClass("show_left_menu")){
   leftMenuHide(leftMenu,content,leftMenuIcon);
 }
});


function leftMenuHide(){
  leftMenu.removeClass("show_left_menu");
  content.removeClass("grey_content");
  leftMenuIcon.attr("src", "/assets/btn_topbar_menuicon.svg");
}


function leftMenuShow(){
  content.addClass("grey_content");
  leftMenu.addClass("show_left_menu");
  leftMenuIcon.attr("src", "/assets/btn_top_close_menu.svg");
}
