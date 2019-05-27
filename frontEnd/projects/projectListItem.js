/*jshint esversion: 6 */
const ListItem = require('./../listItems/listItem');
const InfoHint = require('./../hints/infoHint');
const ListTag = require('./../listItemTag/listItemTag');
const ProjectMenu = require('./projectMenu');
const moment = require('moment');

module.exports = class ProjectListItem extends ListItem {
  constructor(listMethods){
    super();
    this.listMethods = listMethods;
  }

  /**
   * Takes a project object and returns a li dom
   * with the project data
   */
  createItem(proj){
    this.dragIcon = makeDragIcon(this.icons.drag());
    this.dragCol = makeDragCol(this.dragIcon);
    this.tagHolder = makeTagHolder(proj.categoryId, proj.isLearning, proj.deadline);
    this.nameCol = makeNameCol(proj.title, this.tagHolder);
    this.progressCol = makeProgressCol(proj.completedTaskNb, proj.totalTaskNb);
    this.infoIcon = makeInfoIcon(this.icons.info('#7383BF'));
    this.infoCol = makeInfoCol(this.infoIcon, proj.description);
    this.menuIcon = makeMenuIcon(this.icons.menu());
    this.menuCol = makeMenuCol(this.menuIcon, proj._id, this.listMethods);

    let tableRow = $('<tr>',{});
    tableRow.append(this.dragCol)
            .append(this.nameCol)
            .append(this.progressCol)
            .append(this.infoCol)
            .append(this.menuCol);

    let progressRow = makeProgressRow(proj.completedTaskNb, proj.totalTaskNb);

    let li = this.makeLiItem(tableRow, progressRow);
    let liWhData = insertData(li, proj);
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

function makeTagHolder(catId, isLearning, deadline) {
  let container;
  container = $('<div>',{class:'task_label_container'});

  let tag = new ListTag();
  let categoryTag = tag.getCategoryTag(catId);
  let learningTag = tag.getLearningTag(isLearning, catId);

  let timeTag = generateTimeTag(deadline);

  container.append(categoryTag)
           .append(learningTag)
           .append(timeTag);
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


  col.on('click', (e) => {
    e.stopPropagation();
    let contextMenu = new ProjectMenu(icon, id, listMethods);
    contextMenu.showMenu();
  });

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

function insertData(li, proj) {
  li.addClass('stdListItem');
  //  Prevents from being able to slip the item.
  li.addClass('demo-no-swipe');

  li.attr('id', proj._id);
  li.attr('data-title', proj.title);
  li.attr('data-catId', proj.categoryId);
  li.attr('data-description', proj.description);
  li.attr('data-deadline', proj.deadline);
  li.attr('data-isLearning', proj.isLearning);
  li.attr('data-doneTask', proj.completedTaskNb);
  li.attr('data-totalTask', proj.totalTaskNb);
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

//--------------- Time calculation ------------------//

function generateTimeTag(date) {

  if (date==undefined){
    return;
  }

  let deadline = moment(date);
  let today = moment();
  let days = today.diff(deadline, 'days');

  let grey = '#898989';
  let red = '#ff7171';

  let text;
  let color;
  switch (true) {
    case (days == 0):
      text = 'Due today!';
      color = grey;
      break;
    case (days == 1):
      text = 'Due yesterday!';
      color = red;
      break;
    case (days < -1):
      text = `${Math.abs(days)}d left`;
      color = grey;
      break;
    case (days > 0):
      text = `${days}d late `;
      color = red;
      break;
  }

  let span = $('<span>',{text: text});
  span.css('font-size','11px');
  span.css('padding-left','6px');
  span.css('color',color);
  return span;
}
