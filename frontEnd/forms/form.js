/*jshint esversion: 6 */
const shortcuts = require('./../shortcuts/shortcuts');
const Icons = require('./../icons/icons.js');

module.exports = class Form{
  constructor(){
  }

  displayForm(){
    shortcuts.removeMainPageShortcuts();
    $(document.body).append(buildModal());
  }


};

function buildModal(){

  // Modal window
  let modal = $('<div>', {
    class:'modal_centered modal_score',
    id:'modal_score',
    text: 'hey!'
  });

  // Modal background

  let modalBackground = $('<div>', {
    class: 'modal_blackBackground',
    id:'modal_score_background'});

  modalBackground.append(modal);

  return modalBackground;

}
