const ContextMenu = require('./../menus/menu');
const AccountForm = require('./accountForm');
const icons = require('./../icons/icons.js');


module.exports = class AccountMenu extends ContextMenu{
  constructor(trigger){
    super(trigger, 'dummy');

    this.menuClass = 'topMenu_floater';

    this.options = {

      settings:{
        text: 'Settings',
        src: icons.edit(),
        fun: () => {
          let form = new AccountForm();
          form.show();
        }
      },

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
    let topPos = trigger.offset().top - $(window).scrollTop();

    const topOffset = 36;
    const menuWidth = 140;

    let leftOffset;
    if ((leftPos + menuWidth ) < $( window ).width()){
      leftOffset = 0;
    }else{
      leftOffset = -100;
    }

    menu.css({top: topPos + topOffset, left: leftPos + leftOffset});

    return menu;
  }
};
