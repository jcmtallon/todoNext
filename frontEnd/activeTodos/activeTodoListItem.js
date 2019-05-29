/*jshint esversion: 6 */
const ListItem = require('./../listItems/listItem');
const InfoHint = require('./../hints/infoHint');
const ListTag = require('./../listItemTag/listItemTag');
const ActiveTodoMenu = require('./activeTodoMenu');
const moment = require('moment');

module.exports = class ActiveTodoListItem extends ListItem {
  constructor(listMethods){
    super();
    this.listMethods = listMethods;
  }

  /**
   * Takes a project object and returns a li dom
   * with the project data
   */
  createItem(todo){
    this.dragIcon = makeDragIcon(this.icons.drag());
    this.dragCol = makeDragCol(this.dragIcon);
    this.tagHolder = makeTagHolder(todo.categoryId, todo.projectId, todo.isLearning);
    this.nameCol = makeNameCol(todo.title, this.tagHolder);
    this.progressCol = makeProgressCol(todo.progress, todo.hours);
    // this.infoIcon = makeInfoIcon(this.icons.info('#7383BF'));
    // this.infoCol = makeInfoCol(this.infoIcon, todo.description);
    this.menuIcon = makeMenuIcon(this.icons.menu());
    this.menuCol = makeMenuCol(this.menuIcon, todo._id, this.listMethods);

    let tableRow = $('<tr>',{});
    tableRow.append(this.dragCol)
            .append(this.nameCol)
            .append(this.progressCol)
            // .append(this.infoCol)
            .append(this.menuCol);

    let progressRow = makeProgressRow(todo.progress, todo.hours);

    let li = this.makeLiItem(tableRow, progressRow);
    let liWhData = insertData(li, todo);
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

function makeTagHolder(catId, projId, isLearning) {
  let container;
  container = $('<div>',{class:'task_label_container'});

  let tag = new ListTag();
  let categoryTag = tag.getCategoryTag(catId);
  let projectTag = tag.getProjectTag(projId);
  let learningTag = tag.getLearningTag(isLearning, catId);

  container.append(categoryTag).append(projectTag).append(learningTag);
  return container;
}

function makeNameCol(title, tagHolder) {
  let textDiv = $('<div>',{text: title});

  let col;
  col = $('<td>',{
    class:'std_listItem_itemName'});
  col.css('padding-right','18px');
  col.append(textDiv).append(tagHolder);
  return col;
}

function makeProgressCol(done, total) {

  if (total == 1){return;}
  
  let col;
  col = $('<td>',{
    class:'std_listItem_greyInfo',
    text: `${done}/${total}`});
  col.css('padding-right','18px');
  col.css('padding-left','7px');
  return col;
}

function makeInfoIcon(image) {
  let icon;
  icon = image;
  icon.addClass('std_menuIcon');
  return icon;
}

function makeInfoCol(icon, description) {

  let hintFab = new InfoHint(icon);
  let iconWhEvent = hintFab.loadHint(description);

  let col;
  col =  $('<td>',{class:'hideWhenMobile'});
  col.css('padding-right','9px');
  col.append(iconWhEvent);

  return col;
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


  // col.on('click', (e) => {
  //   e.stopPropagation();
  //   let contextMenu = new ProjectMenu(icon, id, listMethods);
  //   contextMenu.showMenu();
  // });

  return col;


}

function makeProgressRow(done, total) {
  let bar;
  bar = $('<div>',{class: 'std_listItem_progressBar'});

  let barWidth = (done <= 0) ? 0 : Math.round((done/total)*100);
  bar.css('width',barWidth + '%');

  // Paints bar green when item complete.
  if(done > 0 && done == total){
    bar.css('background-color','#b6e5a4');
  }

  return bar;
}


//--------------- customize li ----------------/

function insertData(li, todo) {
  li.addClass('stdListItem');
  //  Prevents from being able to slip the item.
  li.addClass('demo-no-swipe');

  li.attr('id', todo._id);
  li.attr('data-title', todo.title);
  li.attr('data-catId', todo.categoryId);
  li.attr('data-notes', todo.notes);
  li.attr('data-dueTo', todo.dueTo);
  li.attr('data-isLearning', todo.isLearning);
  li.attr('data-progress', todo.progress);
  li.attr('data-hours', todo.hours);
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
