/*jshint esversion: 6 */
const ButtonFabric = require('./leftMenuButtonFabric');
const MobileLeftMenu  = require('./mobileLeftMenu');

/**
 * @module
 * Brings together the class in charge of adding click events to the
 * existing left menu buttons, and the class in charge
 * of printing the user custom lists.
 */

// TODO: the left menu is printed by a sub class of this class and not by the ejs.

let menuIconId = 'top_bar_menu_icon_container';

class LeftMenu{
  constructor(){
    this.buttonFabric = new ButtonFabric();
    this.mobile = new MobileLeftMenu();
  }


  /**
   * Applies all left menu events to the different
   * elements of the menu.
   */
  setMenu(){
    this.buttonFabric.addTopButtons();
    this.buttonFabric.addMiddlebuttons();
    this.buttonFabric.addListButtons();

    this.mobile.setWindowResizeEvent();
    this.mobile.setMenuBtnClickEvent(menuIconId);
  }

  get MobileMenu(){
    return this.mobile;
  }
}

module.exports = new LeftMenu();
