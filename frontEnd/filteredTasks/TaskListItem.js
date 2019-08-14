const ListItem = require('./../listItems/listItem');
const InfoHint = require('./../hints/infoHint');
const ListTag = require('./../listItemTag/listItemTag');
// const ActiveTaskMenu = require('./activeTaskMenu');
const moment = require('moment');

let completeGreen = '#3f9c5f';
let pendingRed = '#cc4e7d';
let ongoingBlack = '#00000';
let backgroundGreen = 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(251,251,251,1) 75%, rgba(251,251,251,1) 100%)';
let backgroundRed = 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,250,250,1) 75%, rgba(255,250,250,1) 100%)';
let backgroundYellow = 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,254,231,1) 60%, rgba(255,254,231,1) 100%)';

module.exports = class ActiveTaskListItem extends ListItem {
  constructor(listMethods){
    super();
    this.listMethods = listMethods;
  }

  /**
   * Takes a project object and returns a li dom
   * with the project data
   */
  createItem(task){
    this.tagHolder = makeTagHolder(task.categoryId, task.projectId, task.isLearning, task.notes);
    this.nameCol = makeNameCol(task.title, this.tagHolder);
    this.progressCol = makeProgressCol(task.progress, task.hours, this.icons.starActive(), task.status);
    this.DeadlineCol = makeDeadlineCol(task.dueTo, task.habitId, task.status);
    this.urgencyIcon = makeUrgencyIcon(this.icons, task.urgency, task.status);
    this.urgencyCol = makeUrgencyCol(this.urgencyIcon);
    this.menuIcon = makeMenuIcon(this.icons.menu());
    this.menuCol = makeMenuCol(this.menuIcon, task.instantId, this.listMethods);

    let tableRow = $('<tr>',{});
    tableRow.append(this.nameCol)
            .append(this.progressCol)
            .append(this.DeadlineCol)
            .append(this.urgencyCol)
            .append(this.menuCol);

    let progressRow = makeProgressRow(task.progress, task.hours, task.status);
    let li = this.makeLiItem(tableRow, progressRow);
    li.css('background', this._getStatusColor(task.status));
    let liWhData = insertData(li, task);
    this.listItem = addHoverEvent(liWhData, [this.menuCol]);
    return this.listItem;
  }

  _getStatusColor(status){
    switch (status) {
      case 'complete':
        return backgroundGreen;
      case 'pending':
        return backgroundRed;
      case 'ongoing':
        return backgroundYellow;
      default:
        return 'white';
    }
  }
};

//--------- create columns ------------------//

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

function makeProgressCol(done, total, starIcon, status) {


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

 if(status!=''){
   let color;
   switch (status) {
     case 'complete':
       color = completeGreen;
       break;
     case 'pending':
       color = pendingRed;
       break;
     case 'ongoing':
       color = ongoingBlack;
   }
   col.css('color', color);
   col.css('font-style','italic');
 }

  return col;
}


function makeDeadlineCol(dueTo, habitId, status) {

  let deadline = moment(dueTo).format('MMM D');

  let col = $('<td>',{
    class:'activeTask_deadlineCol',
    text: deadline});

  if(habitId!='' && habitId!=undefined){
    col.css('font-style','italic');
    col.css('color','#1551b5');
  }

  if(status!=''){
    let color;
    switch (status) {
      case 'complete':
        color = completeGreen;
        break;
      case 'pending':
        color = pendingRed;
        break;
      case 'ongoing':
        color = ongoingBlack;
    }
    col.css('color', color);
    col.css('font-style','italic');
  }

  return col;
}


function makeUrgencyIcon(icons, urgency, status) {

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

  function getStatusIcon(value){
    switch (value) {
      case 'complete':
        return icons.complete(completeGreen);
      case 'pending':
        return icons.pending2(pendingRed);
    }
  }

  let icon = (status=='' || status == 'ongoing') ? get_urgency_icon(urgency) : getStatusIcon(status);
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
    // e.stopPropagation();
    // let contextMenu = new ActiveTaskMenu(icon, id, listMethods);
    // contextMenu.showMenu();
  });

  return col;


}

function makeProgressRow(done, total, status) {
  let bar;
  bar = $('<div>',{class: 'std_listItem_progressBar'});

  let barWidth = (done <= 0) ? 0 : Math.round((done/total)*100);
  if (status == 'complete') barWidth = 0;

  bar.css('width',barWidth + '%');

  // Paints bar green when item complete.
  if(done > 0 && done == total){
    bar.css('background-color','#b6e5a4');
  }

  return bar;
}


//--------------- customize li ----------------/

function insertData(li, task) {
  li.addClass('stdListItem');
  //  Prevents from being able to slip the item.
  li.addClass('demo-no-swipe');

  li.attr('id', task._id);
  li.attr('data-title', task.title);
  li.attr('data-dueTo', task.dueTo);
  li.attr('data-urgency', task.urgency);
  li.attr('data-hours', task.hours);
  li.attr('data-progress', task.progress);
  li.attr('data-isLearning', task.isLearning);
  li.attr('data-status', task.status);
  li.attr('data-categoryId', task.categoryId);
  li.attr('data-projectId', task.projectId);
  li.attr('data-habitId', task.habitId);
  li.attr('data-notes', task.notes);
  li.attr('data-instantId', task.instantId);
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
