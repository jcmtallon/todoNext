/*jshint esversion: 6 */


module.exports = class ListView{
  constructor(){
    this.listContainer = getListContainer();
  }
};



function getListContainer(){
  let ol = $('<ol>', {
    tabindex:'0',
    class: 'stdListContainer'
  });
  return ol;
}
