/*jshint esversion: 6 */
const addTaksForm = require('./../../forms/add_task_form');
const hints = require('./../../hints/help_hint');


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
  let addTodoBtn = $('#top_bar_add_btn');
  addTodoBtn.on('click', function(){
      addTaksForm.showModal();
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
