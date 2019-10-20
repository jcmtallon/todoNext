const OPTIONS = require('./../../optionHandler/OptionHandler');
const addTaksForm = require('./../../activeTodos/addTaskForm/addTaskForm');
const hints = require('./../../hints/help_hint');
const shortcuts = require('./../../shortcuts/shortcuts');
const StatPanel = require('./../../statPanel/statPanel');
const AccountMenu = require('./../../account/AccountMenu');
const CalendarPanel = require('./../../calendar/CalendarPanel');

const storageName = 'statPanelStatus';

class TopBar{
  constructor(){
  }

  /**
   * Applies events to top bar buttons and adds current date
   * functionality to top bar middle label (only available in large screen mode)
   */
  setTopBar(){
    setButtonClickEvents();
    setDate();
    hints.loadHints('.hintHolder');
  }
}


function setButtonClickEvents(){
  let addTaskBtn = $('#top_bar_add_btn')
                  .click(() =>{
                    shortcuts.removeAllGlobalShortcuts();
                    addTaksForm.showModal();
  });


  let statBtn = $('#top_bar_stats_btn')
                .click( async ()=>{

                  //Cancel if panel is in the process to be opened.
                  let isOpening = localStorage.getItem(storageName);
                  if (isOpening == "true") return;

                  // Flag as opening.
                  localStorage.setItem(storageName, true);

                  let projects = await OPTIONS.projects.getProjectOptions();
                  // Flag as opened.
                  localStorage.setItem(storageName, false);

                  let statPanel = new StatPanel();
                  statPanel.show(projects);
                });

}

let calendarBtn = $('#top_bar_calendar_btn').click((e) =>{
                  e.stopPropagation();

                  let calendarPanel = new CalendarPanel();
                  calendarPanel.show();
                });

let accountBtn = $('#top_bar_account_btn')
                .click((e)=>{
                  e.stopPropagation();
                  hints.hideHints();
                  const menu = new AccountMenu(accountBtn);
                  menu.showMenu();
                  menu.fixPosition();
                  menu.setRowHeight(50);
                  menu.setWidth(140);
                });

function setDate(){
  const todaysDate = new Date();

  function short_month(dt){
    let shortMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return shortMonths[dt.getMonth()];}

  const todaysDateString = short_month(todaysDate) + ' ' + todaysDate.getDate() + ', ' + todaysDate.getFullYear();
  $('#top_bar_center').text(todaysDateString);
}

 module.exports = new TopBar();
