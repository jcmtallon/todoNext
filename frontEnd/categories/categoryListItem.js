/*jshint esversion: 6 */
const ListItem = require('./../listItems/listItem');
const InfoHint = require('./../hints/infoHint');
const CategoryMenu = require('./categoryMenu');

module.exports = class CategoryListItem extends ListItem {
  constructor(listMethods){
    super();
    this.listMethods = listMethods;
  }

  /**
   * Takes a category object and returns a li dom
   * with the category data
   */
  createItem(cat){
    this.dragIcon = makeDragIcon(this.icons.drag());
    this.dragCol = makeDragCol(this.dragIcon);
    this.colorMark = makeColorMark(cat.color);
    this.colorCol = makeColorCol(this.colorMark);
    this.nameCol = makeNameCol(cat.title);
    this.progressCol = makeProgressCol(cat.completedTaskNb, cat.totalTaskNb);
    this.infoIcon = makeInfoIcon(this.icons.info('#7383BF'));
    this.infoCol = makeInfoCol(this.infoIcon, cat.description);
    this.menuIcon = makeMenuIcon(this.icons.menu());
    this.menuCol = makeMenuCol(this.menuIcon, cat._id, this.listMethods);

    let tableRow = $('<tr>',{});
    tableRow.append(this.dragCol)
            .append(this.colorCol)
            .append(this.nameCol)
            .append(this.progressCol)
            .append(this.infoCol)
            .append(this.menuCol);

    let li = this.makeLiItem(tableRow);
    let liWhData = insertData(li, cat);
    this.listItem = addHoverEvent(liWhData, [this.dragIcon, this.menuCol]);
    return this.listItem;
  }
};

//--------- create columns ------------------//

function makeDragIcon(image) {
  let icon;
  icon = image;
  icon.addClass('std_DragBtn instant');
  icon.css('padding-top','2px');
  return icon;
}

function makeDragCol(icon) {
  let col;
  col = $('<td>',{});
  col.append(icon);
  return col;
}

function makeColorMark(color) {
  let mark;
  mark = $('<div>',{class:'std_catColorSquare'});
  mark.css('background-color',color);
  return mark;
}

function makeColorCol(mark) {
  let col;
  col = $('<td>',{});
  col.css('padding-left','8px');
  col.append(mark);
  return col;
}

function makeNameCol(title) {
  let col;
  col = $('<td>',{
    class:'std_listItem_itemName',
    text: title});
  col.css('padding-right','18px');
  return col;
}

function makeProgressCol(done, total) {
  let col;
  col = $('<td>',{
    class:'std_listItem_greyInfo',
    text: `${done}/${total}`});
  col.css('padding-right','18px');
  return col;
}

function makeInfoIcon(image) {
  let icon;
  icon = image;
  icon.addClass('std_menuIcon');
  return icon;
}

function makeInfoCol(icon, description) {
  let col;
  col =  $('<td>',{class:'hideWhenMobile'});
  col.css('padding-right','9px');
  col.append(icon);

  let hintFab = new InfoHint(col);
  let colWhEvent = hintFab.loadHint(description);
  return colWhEvent;
}

function makeMenuIcon(image) {
  let icon;
  icon = image;
  icon.addClass('std_menuIcon');
  return icon;
}

function makeMenuCol(icon, id, listMethods) {
  let col;
  col = $('<td>',{class: 'std_listItem_MenuCol'});
  col.append(icon);


  col.on('click', (e) => {
    e.stopPropagation();
    let contextMenu = new CategoryMenu(icon, id, listMethods);
    contextMenu.showMenu();
  });

  return col;


}

//--------------- customize li ----------------/

function insertData(li, cat) {
  li.addClass('stdListItem');
  //  Prevents from being able to slip the item.
  li.addClass('demo-no-swipe');

  li.attr('id', cat._id);
  li.attr('data-title', cat.title);
  li.attr('data-color', cat.color);
  li.attr('data-description', cat.description);
  li.attr('data-doneTask', cat.completedTaskNb);
  li.attr('data-totalTask', cat.totalTaskNb);
  return li;
}


//--------------- Add events ------------------//

function addHoverEvent(li, cols) {

  if($( window ).width()>950){
    cols.forEach(function(col) {
      li.hover(e => col.animate({opacity: 1}, 0),
               e => col.animate({opacity: 0}, 0));
    });
  }
  return li;
}
