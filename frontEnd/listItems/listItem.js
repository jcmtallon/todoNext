/*jshint esversion: 6 */
const icons = require('./../icons/icons.js');

module.exports = class ListItem {
  constructor(){
    this.icons = icons;
  }

  makeLiItem(row){
    return makeLiItemDom(row);
  }

};


//--------- create li item ------------------//

function makeLiItemDom(row) {
  let tbody;
  tbody = $('<tbody>',{});
  tbody.append(row);

  let table;
  table = $('<table>',{});
  table.append(tbody);

  let container;
  container = $('<div>',{class:'stdListItemContainer'});
  container.css('padding-bottom','18px');
  container.append(table);

  let li = $('<li>', {});
  li.css('background-color','rgb(255,255,255)');
  li.append(container);
  return li;


}
