
// Module in charge of displaying and hidding the different ui menus.

exports.leftMenuHide = function(leftMenu,content,leftMenuIcon){
  leftMenu.removeClass("show_left_menu");
  content.removeClass("grey_content");
  leftMenuIcon.attr("src", "/assets/btn_topbar_menuicon.svg");
};

exports.leftMenuShow = function(content,leftMenu,leftMenuIcon){
  content.addClass("grey_content");
  leftMenu.addClass("show_left_menu");
  leftMenuIcon.attr("src", "/assets/btn_top_close_menu.svg");
};
