/*jshint esversion: 6 */

/**
 * Represents a button with two states (true/false) and with
 * two different looks depending on the state.
 * The button is form of an icon and a label.
 */


 module.exports = class BooleanButton{
   constructor(labelText, icon){
     this.labelText = labelText;
     this.icon = icon;
   }


   /**
    * Returns a button element with the passed value
    * applied to it.
    */
   createButtonWithIcon(value){

     this.value = value;

     this.iconHolder = buildIconHolder();
     this.label = buildLabel(this.labelText);
     this.button = buildButton(this.iconHolder,
                               this.label);
  　　this.button = addClickHandler(this.button, this);
      this.button = addHoverHandler(this.button, this);
      this.buton = addFocusHandler(this.button, this);
      this.buton = addKeyHandler(this.button, this);

     this.toogleValue(this.value);
     return this.button;
   }



   /**
    * Adds hover style to button.
    */
   addHoverStyle(){
     this.hoverStyle = 'booleanBtn_hover';
     this.button.addClass(this.hoverStyle);
   }

   /**
    * Removes hover style from button.
    */
   removeHoverStyle(){
     this.button.removeClass(this.hoverStyle);
   }


   /**
    * If a value was received, applies such value to
    * the button. If no value was received, the opposite
    * value to the current one is applied to the button.
    */
   toogleValue(value){

   if (value!= undefined){
     this.value = value;
   }else{
     this.value = !this.value;
   }

   let btnColor = '';
   btnColor = (this.value == true) ? '#1551b5' : '#dddddd';

   // Change icon.
   let icon;
   icon = this.icon(btnColor);
   this.iconHolder.empty();
   this.iconHolder.append(icon);

   // Change button style
   let activeStyle = 'booleanBtn_active';

   if (this.value == true){

     this.button.addClass(activeStyle);
   } else {
     this.button.removeClass(activeStyle);
   }

   // Change button attribute
   this.button.attr('data-value',this.value);

   }

 };



// -------------------- Build methods ------------------------------//

function buildIconHolder() {
  let iconHolder;
  iconHolder = $('<td>',{class: 'booleanBtn_iconHolder'});
  return iconHolder;
}

function buildLabel(labelText) {
  let label;
  label = $('<td>',{text: labelText, class:'booleanBtn_label'});
  label.css('width', '100%');
  return label;
}

 function buildButton(icon, label) {

   let tr;
   tr = $('<tr>',{});
   tr.append(icon)
     .append(label);

   let tbody;
   tbody = $('<tbody>',{});
   tbody.append(tr);

   let table;
   table = $('<table>',{});
   table.append(tbody);

   let btn;
   btn = $('<div>',{class: 'booleanBtn_holder'});
   btn.append(table);
   return btn;
 }



// -------------------- Add events ------------------------------//


 function addClickHandler(btn, obj) {
   btn.on('click', (e) => {
     e.stopPropagation();
     obj.toogleValue();
   });
   return btn;
 }

 function addHoverHandler(btn, obj) {
   btn.hover(
     e => obj.addHoverStyle(),
     e => obj.removeHoverStyle()
   );
   return btn;
 }

 function addFocusHandler(btn, obj) {
   btn.focus(() => {obj.addHoverStyle();});
   btn.focusout(() => {obj.removeHoverStyle();});
 }

function addKeyHandler(btn, obj) {
  btn.keydown((e) =>{
    if (e.keyCode ==13 || e.keyCode ==32){
       e.preventDefault();
       e.stopPropagation();
       obj.toogleValue();
     }
  });
  return btn;
}
