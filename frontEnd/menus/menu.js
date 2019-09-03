/*jshint esversion: 6 */
const shortcuts = require('./../shortcuts/shortcuts');

// Task: poner el ancho del trigger y menu en variables.

module.exports = class ContextMenu{
  constructor(trigger, listItemId, usesInstantId = false){
    // Used to reference the icon/btn that triggered this
    // menu, for menu position calculation.
    this.trigger = trigger;
    // Used to reference the corresponding list item
    // to give a highlight effect.
    this.listItemId = listItemId;
    // Used to give style and as a identifier
    // for this type of context menus.
    this.menuClass = 'contextMenu_floater';
    // Used to know which is the id that has to be checked
    // when blue highlighting the list items.
    this.usesInstantId = usesInstantId;
  }


  /**
   * Disables global shortcuts and builds and display a menu
   * with the buttons charged via the instantiated object.
   */
  showMenu(){

    // Remove existing menus
    this.removeExistingMenus();
    this.removeListItemHightlights();

    // Disable main page shortcuts.
    shortcuts.removeAllGlobalShortcuts();

    let tbody = $('<tbody>',{});
    this.tbody = buildRows(tbody, this.options, this.listItemId);

    let menu = buildMenu(this.tbody, this.menuClass);
    this.menu = calculatePosition(menu, this.trigger);

    $(document.body).append(this.menu);

    setListItemHightlight(this.listItemId, this.usesInstantId);
    setOutsideClickEvent(this.menu, this.listItemId, this.usesInstantId);
    setMenuShortcuts(this.menu, this.listItemId, this.usesInstantId);
  }


/**
 * Removes any existing context menu of this same style,
 * to prevent duplicates and possible errors.
 */
  removeExistingMenus(){
    let existingMenus = $(`.${this.menuClass}`);
    existingMenus.remove();
  }

  removeListItemHightlights(){
    let highlightedItems;
    highlightedItems =  $(`.listItem_menuHighlight`);
    highlightedItems.removeClass('listItem_menuHighlight');
  }
};

//---------------------------build menu ---------------------//

  function buildMenu(tbody, menuClass) {
  let table;
  table = $('<table>',{class:'contextMenu_table'});
  table.append(tbody);

  let innerHolder;
  innerHolder = $('<div>',{class:'contextMenu_innerHolder'});
  innerHolder.append(table);

  let menu;
  menu = $('<div>', {class: menuClass});
  menu.append(innerHolder);

  return menu;
}


function buildRows(tbody, options, listItemId) {
  $.each( options, ( index, option ) => {
    tbody.append(buildMenuRow(option, listItemId));
  });
  return tbody;
}


function buildMenuRow(option, listItemId) {
  let icon;
  icon = option.src;
  icon.addClass('svgDefaultStyle');

  let iconCol;
  iconCol =  $('<div>',{class:'ddm_menu_rowLeftCol'});
  iconCol.append(icon);

  let textCol;
  textCol =  $('<div>',{
    class:'ddm_menu_rowRightCol',
    text: option.text});

  let container;
  container = $('<div>');
  container.css('display','flex');
  container.css('align-items','center');
  container.append(iconCol).append(textCol);

  let td;
  td = $('<td>',{class:'ddm_menu_rowColumn'});
  td.append(container);

  let tr;
  tr = $('<tr>');
  tr.append(td);

  // Add action
  tr.click(()=>{
    option.fun(listItemId);
  });

  // Add mouseover event
  tr.mouseenter(()=>{tr.css('background-color','#ededed');});
  tr.mouseleave(()=>{tr.css('background-color','white');});

  return tr;
}




//--------------- Get position --------------- //

function calculatePosition(menu, trigger) {

  let leftPos = trigger.offset().left;
  let topPos = trigger.offset().top;

  // Adjust left value if menu goes out of the screen.
  // 185 is the width of the contextmenu.
  if ((leftPos + 185 ) > $( window ).width()){

    //33 is added to align the menu to the right side of
    // the icon.
    leftPos = leftPos - 185 + 33;
  }

  // Apply values.
  menu.css({top:topPos + 32, left: leftPos + 13});

  return menu;
}


//--------------- Hightligh --------------- //


function setListItemHightlight(listItemId, usesInstantId) {
  let listItem;
  listItem = (usesInstantId) ? $(`[data-instantId=${listItemId}]`) : $(`#${listItemId}`);
  listItem.addClass('listItem_menuHighlight');
}


//--------------- Close Events --------------- //


function setOutsideClickEvent(menu, listItemId, usesInstantId) {
  // Close menu wherever the user clicks.
  $(document).click((e) =>{
    e.stopPropagation();
      closeTaskMenu(menu, listItemId, usesInstantId);
      restoreShortcuts();
  });
}

function setMenuShortcuts(menu, listItemId, usesInstantId) {
  // Close menu when clicking escape key.
  // (we remove keydowns before to avoid possible duplicates)
  $(document).off('keydown');
  $(document).keydown((e) => {
    if (e.keyCode == 27) {
      closeTaskMenu(menu, listItemId, usesInstantId);
      restoreShortcuts();
    }
  });
}


function closeTaskMenu(menu, listItemId, usesInstantId){
  //Remove menu
  menu.remove();
  //Remove list item highlight
  let listItem;
  listItem = (usesInstantId) ? $(`[data-instantId=${listItemId}]`) : $(`#${listItemId}`);
  listItem.removeClass('listItem_menuHighlight');
  //Remove menu shortcuts
  $(document).off('click');
}


function restoreShortcuts(){
  //we remove first to avoid possible duplicates.
  shortcuts.removeAllGlobalShortcuts();
  shortcuts.setAllGlobalShortcuts();
}
