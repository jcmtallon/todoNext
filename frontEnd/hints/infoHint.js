/*jshint esversion: 6 */
const Hint = require('./hint');
const icons = require('./../icons/icons');

/** @Module
 *  A type of hint used for providing general information
 *  to the user like item descriptions, etc.
 *  Hint already has methods for loading showing and removing
 *  hints. This method only needs to indicate the specific
 *  style of this type of hints.
 */

 module.exports = class InfoHint extends Hint{
   constructor(triggerElement){
     super(triggerElement);
     this.maxWidth = 300;
     this.offsetX = 26; // offset between trigger left and hint left.
     this.offsetY = 20; // offset between trigger top and hint top.
     this.defaultText = 'No description yet.';
     this.createHint = (hintText) => {return createHint(hintText,
                                                        this.maxWidth);};
   }
 };


 function createHint(hintText, maxWidth) {

   let icon;
   icon = icons.info('#ffffff');
   icon.addClass('std_menuIcon');
   icon.css('padding-right','9px');

   let leftCol;
   leftCol = $('<td>',{});
   leftCol.css('vertical-align','top');
   leftCol.append(icon);

   let rightCol;
   rightCol = $('<td>',{
     text: hintText});

   let row;
   row = $('<tr>',{});
   row.append(leftCol).append(rightCol);

   let tbody;
   tbody = $('<tbody>',{});
   tbody.append(row);

   let table;
   table = $('<table>',{});
   table.append(tbody);

   let textBox;
   textBox = $('<div>',{class:'hintBoxContent'});
   textBox.css('background-color','#263e65');
   textBox.css('max-width', maxWidth + 'px');
   textBox.css('border-radius', '7px');
   textBox.append(table);

   let frame;
   frame = $('<div>',{class:'hint_frame'});
   frame.append(textBox);
   return frame;
 }
