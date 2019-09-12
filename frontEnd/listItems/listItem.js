const icons = require('./../icons/icons.js');

module.exports = class ListItem {
  constructor(){
    this.icons = icons;
  }

  makeLiItem(row, secondRow){
    return makeLiItemDom(row, secondRow);
  }

};


//--------- create li item ------------------//

function makeLiItemDom(row, secondRow) {
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
  if(secondRow != undefined){li.append(secondRow);}
  return li;
}
