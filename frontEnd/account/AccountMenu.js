const ContextMenu = require('./../menus/menu');
const icons = require('./../icons/icons.js');


module.exports = class AccountMenu extends ContextMenu{
  constructor(trigger){
    super(trigger, 'dummy');

    this.menuClass = 'topMenu_floater';

    this.options = {
      logout:{
        text: 'Logout',
        src: icons.logout(),
        fun: () => {
          window.open('/users/logout','_self');
        }
      }
    };
  }

  //--------------- Get position --------------- //

  //@overwrite
  calculatePosition(menu, trigger) {

    let leftPos = trigger.offset().left;
    let topPos = trigger.offset().top;

    const topOffset = 36;
    const leftOffset = -141;
    menu.css({top: topPos + topOffset, left: leftPos + leftOffset});

    return menu;
  }
};
