/*jshint esversion: 6 */
const ListItem = require('./../listItems/listItem');
const InfoHint = require('./../hints/infoHint');
const ListTag = require('./../listItemTag/listItemTag');
const HabitMenu = require('./habitMenu');
const filteredTaskPage = require('./../filteredTasks/filteredTaskPage');
const moment = require('moment');

module.exports = class HabitListItem extends ListItem {
  constructor(listMethods){
    super();
    this.listMethods = listMethods;
  }

  /**
   * Takes a habit object and returns a li dom
   * with the habit data
   */
  createItem(hab){
    this.tagHolder = makeTagHolder(hab.categoryId, hab.frequency);
    this.nameCol = makeNameCol(hab.title, this.tagHolder);
    this.nextDateCol = makeNextDateCol(hab.lastTaskDate, hab.isActive);
    this.infoIcon = makeInfoIcon(this.icons.info('#7383BF'));
    this.infoCol = makeInfoCol(this.infoIcon, hab.description);
    this.urgencyIcon = makeUrgencyIcon(this.icons, hab.urgency);
    this.urgencyCol = makeUrgencyCol(this.urgencyIcon);
    this.menuIcon = makeMenuIcon(this.icons.menu());
    this.menuCol = makeMenuCol(this.menuIcon, hab._id, this.listMethods);

    let tableRow = $('<tr>',{});
    tableRow.append(this.nameCol)
            .append(this.nextDateCol)
            .append(this.infoCol)
            .append(this.urgencyCol)
            .append(this.menuCol);

    let li = this.makeLiItem(tableRow);
    let liWhData = insertData(li, hab);
    this.listItem = addHoverEvent(liWhData, [this.menuCol]);
    return this.listItem;
  }
};

//--------- create columns ------------------//


function makeTagHolder(catId, frequency) {
  let container;
  container = $('<div>',{class:'task_label_container'});

  let tag = new ListTag(filteredTaskPage);
  let categoryTag = tag.getCategoryTag(catId);

  let timeTag = generateFrequencyTag(frequency);

  container.append(categoryTag)
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

function makeNextDateCol(nextDate, isActive) {

  let col;
  col = $('<td>',{
    class:'std_listItem_greyInfo'});
  col.css({'padding-right':'18px',
          'padding-left':'7px',
          'white-space': 'nowrap'});

  if (!isActive){
    col.text('Stopped!');
    col.css('color','#ff7171');
    return col;
  }

  let today = moment();
  today.set({hour:0,minute:0,second:0,millisecond:0});
  let deadline = moment(nextDate);
  let days = today.diff(deadline,'days');

  let grey = '#898989';
  let red = '#ff7171';

  let text;
  let color;

  switch (true) {
    case (days == 0):
      text = 'Tomorrow!';
      color = grey;
      break;
    case (days >= 1):
      text = `${Math.abs(days)} days ago`;
      color = red;
      break;
    case (days < 0):
      text = `In ${Math.abs(days-1)} days`;
      color = grey;
      break;
  }

  col.text(text);
  col.css('color',color);
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
    let contextMenu = new HabitMenu(icon, id, listMethods);
    contextMenu.showMenu();
  });

  return col;


}



//--------------- customize li ----------------/

function insertData(li, hab) {
  li.addClass('stdListItem');

  li.attr('id', hab._id);
  li.attr('data-title', hab.title);
  li.attr('data-description', hab.description);
  li.attr('data-categoryId', hab.categoryId);
  li.attr('data-frequency', hab.frequency);
  li.attr('data-hours', hab.hours);
  li.attr('data-lastTaskDate', hab.lastTaskDate);
  li.attr('data-urgency', hab.urgency);
  li.attr('data-isActive', hab.isActive);
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

//--------------- Frequency tag ------------------//

function generateFrequencyTag(frequency) {

  let grey = '#898989';
  let text = (frequency == 1) ? `Everyday`:`Every ${frequency} days`;

  let span = $('<span>',{text: text});
  span.css({'font-size':'11px',
            'padding-left':'6px',
            'vertical-align':'top',
            'color': grey});

  return span;
}
