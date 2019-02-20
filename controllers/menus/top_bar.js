/*jshint esversion: 6 */

const addTaksForm = require('./../forms/add_task_form');
const Shortcuts = require('./../shortcuts/shortcuts');
const Hints = require('./../hints/help_hint');

/**
 * @Module
 * Applies click events to top bar elements.
 */



 //Displays add task form
 $('#top_bar_add_btn').on('click', function(){
     Shortcuts.removeMainPageShortctus();
     addTaksForm.showModal();
 });


 //Add date to top bar
 const todaysDate = new Date();

 function short_month(dt){
   let shortMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
   return shortMonths[dt.getMonth()];}

 const todaysDateString = short_month(todaysDate) + ' ' + todaysDate.getDate() + ', ' + todaysDate.getFullYear();
 $('#top_bar_center').text(todaysDateString);


 //Load hints into the top bar buttons.
 Hints.loadHints('.hintHolder');
