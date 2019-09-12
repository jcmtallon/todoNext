/*jshint esversion: 6 */
const ListItem = require('./../../listItems/listItem');
const InfoHint = require('./../../hints/infoHint');
const ListTag = require('./../../listItemTag/listItemTag');
const ProjectMenu = require('./comProjectMenu');
const filteredTaskPage = require('./../../filteredTasks/filteredTaskPage');
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
    this.tagHolder = makeTagHolder(proj.categoryId, proj.isLearning, proj.completedTaskNb);
    this.nameCol = makeNameCol(proj.title, this.tagHolder, proj._id);
    this.dateCol = makeDateCol(proj.completedBy);
    this.infoIcon = makeInfoIcon(this.icons.info('#7383BF'));
    this.infoCol = makeInfoCol(this.infoIcon, proj.description);
    this.menuIcon = makeMenuIcon(this.icons.menu());
    this.menuCol = makeMenuCol(this.menuIcon, proj._id, this.listMethods);

    let tableRow = $('<tr>',{});
    tableRow.append(this.nameCol)
            .append(this.dateCol)
            .append(this.infoCol)
            .append(this.menuCol);


    let li = this.makeLiItem(tableRow);
    let liWhData = insertData(li, proj);
    this.listItem = addHoverEvent(liWhData, [this.menuCol]);
    return this.listItem;
  }
};

//--------- create columns ------------------//

function makeTagHolder(catId, isLearning, completeNb) {
  let container;
  container = $('<div>',{class:'task_label_container'});

  let tag = new ListTag(filteredTaskPage);
  let categoryTag = tag.getCategoryTag(catId);
  let learningTag = tag.getLearningTag(isLearning, catId);

  let timeTag = generateTotalTag(completeNb);

  container.append(categoryTag)
           .append(learningTag)
           .append(timeTag);
  return container;
}

function makeNameCol(title, tagHolder, id) {
  let textDiv = $('<div>',{text: title})
                .css('cursor', 'pointer')
                .click(()=>{
                  const renderQuery = {fadeIn: true,
                                       scrollToTop: true};
                  const searchQuery = {pageNb: 1,
                                       projectId: id};
                  filteredTaskPage.show(renderQuery, searchQuery);
                });

  let col;
  col = $('<td>',{
    class:'std_listItem_itemName'});
  col.css('padding-right','18px');
  col.append(textDiv).append(tagHolder);
  return col;
}

function makeDateCol(date) {

  let formattedDate;
  formattedDate = moment(date).format('MMM D YYYY');

  let col;
  col = $('<td>',{
    class:'std_listItem_greyInfo',
    text: `${formattedDate}`});
  col.css({'padding-right':'18px',
          'padding-left':'7px',
          'min-width' : '40px',
          'text-align' : 'right'});
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

function generateTotalTag(total) {

  let text;
  text = (total > 1) ? `${total} tasks` : `${total} task`;

  let grey = '#898989';

  let span = $('<span>',{text: text});
  span.css('font-size','11px');
  span.css('padding-left','6px');
  span.css('color',grey);
  return span;
}
