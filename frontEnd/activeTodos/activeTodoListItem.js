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
    this.tagHolder = makeTagHolder(todo.categoryId, todo.projectId, todo.isLearning, todo.notes);
    this.nameCol = makeNameCol(todo.title, this.tagHolder);
    this.progressCol = makeProgressCol(todo.progress, todo.hours, this.icons.starActive());
    this.DeadlineCol = makeDeadlineCol(todo.dueTo, todo.habitId);
    this.urgencyIcon = makeUrgencyIcon(this.icons, todo.urgency);
    this.urgencyCol = makeUrgencyCol(this.urgencyIcon);
    this.menuIcon = makeMenuIcon(this.icons.menu());
    this.menuCol = makeMenuCol(this.menuIcon, todo.instantId, this.listMethods);

    let tableRow = $('<tr>',{});
    tableRow.append(this.dragCol)
            .append(this.nameCol)
            .append(this.progressCol)
            .append(this.DeadlineCol)
            .append(this.urgencyCol)
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

function makeTagHolder(catId, projId, isLearning, notes) {
  let container;
  container = $('<div>',{class:'task_label_container'});

  let tag = new ListTag();
  let categoryTag = tag.getCategoryTag(catId);
  let projectTag = tag.getProjectTag(projId);
  let learningTag = tag.getLearningTag(isLearning, catId);
  let notesTag = tag.getNotesTag(notes, catId);

  container.append(categoryTag).append(projectTag).append(learningTag).append(notesTag);
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

function makeProgressCol(done, total, starIcon) {


  // When total is 1, no need to show the col.
  if (total == 1){return;}

  let col;
  col = $('<td>',{class:'hour_icon_container'});

  // When score, show icon
  if(total == 'Score'){
    let icon = starIcon;
    icon.addClass('std_menuIcon');
    col.append(icon);
    return col;
  }

  // When no score, show done/total
  col.text(`${done}/${total}`);
  col.css({'text-align' : 'right',
           'color' : '#1551b5'});

  return col;
}


function makeDeadlineCol(dueTo, habitId) {

  let deadline = moment(dueTo).format('MMM D');

  let col = $('<td>',{
    class:'activeTask_deadlineCol',
    text: deadline});

  if(habitId!='' && habitId!=undefined){
    col.css('font-style','italic');
    col.css('color','#1551b5');
  }

  return col;
}


function makeUrgencyIcon(icons, urgency) {

  function get_urgency_icon(value){
    switch (value) {
      case 'High':
        return icons.urgHigh();
      case 'Normal':
        return icons.urgNormal();
      case 'Low':
        return icons.urgLow();
    }
  }

  let icon = get_urgency_icon(urgency);
  icon.addClass('std_menuIcon');
  return icon;
}

function makeUrgencyCol(icon) {
  let col = $('<td>',{class:'activeTask_arrow_container'});
  col.append(icon);
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
    let contextMenu = new ActiveTodoMenu(icon, id, listMethods);
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

function insertData(li, todo) {
  li.addClass('stdListItem');
  //  Prevents from being able to slip the item.
  li.addClass('demo-no-swipe');

  li.attr('id', todo._id);
  li.attr('data-title', todo.title);
  li.attr('data-dueTo', todo.dueTo);
  li.attr('data-urgency', todo.urgency);
  li.attr('data-hours', todo.hours);
  li.attr('data-progress', todo.progress);
  li.attr('data-isLearning', todo.isLearning);
  li.attr('data-status', todo.status);
  li.attr('data-categoryId', todo.categoryId);
  li.attr('data-projectId', todo.projectId);
  li.attr('data-habitId', todo.habitId);
  li.attr('data-notes', todo.notes);
  li.attr('data-instantId', todo.instantId);
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
