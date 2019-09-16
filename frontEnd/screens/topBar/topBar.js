const OPTIONS = require('./../../optionHandler/OptionHandler');
const addTaksForm = require('./../../activeTodos/addTaskForm/addTaskForm');
const hints = require('./../../hints/help_hint');
const shortcuts = require('./../../shortcuts/shortcuts');
const StatPanel = require('./../../statPanel/statPanel');


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
                  let projects = await OPTIONS.projects.getProjectOptions();
                  let statPanel = new StatPanel();
                  statPanel.show(projects);
                });

}

function setDate(){
  const todaysDate = new Date();

  function short_month(dt){
    let shortMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return shortMonths[dt.getMonth()];}

  const todaysDateString = short_month(todaysDate) + ' ' + todaysDate.getDate() + ', ' + todaysDate.getFullYear();
  $('#top_bar_center').text(todaysDateString);
}

 module.exports = new TopBar();
