/*jshint esversion: 6 */
const LeftMenuEventLoader = require('./LeftMenuEventLoader');
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
    this._eventLoader = new LeftMenuEventLoader();
    this._mobile = new MobileLeftMenu();
  }


  /**
   * Applies all left menu events to the different
   * elements of the menu.
   */
  setMenuEvents(){
    this._eventLoader.addEventsToTopBtns();
    this._eventLoader.addEventsToMiddleBtns();
    this._mobile.setWindowResizeEvent();
    this._mobile.setMenuBtnClickEvent(menuIconId);
  }

  get MobileMenu(){
    return this._mobile;
  }
}

module.exports = new LeftMenu();
