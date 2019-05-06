/*jshint esversion: 6 */

/** @Module
 *  Creates and controls a hint element that can be displayed
 *  when hovering other elements in the app ui.
 */

 module.exports = class Hint{
   constructor(triggerElement){
     this.trigger = triggerElement; //jquery item.
   }

   /**
    * Applies hover event to element loaded with the class constructor.
    * The hover displays a hint with the passed text.
    * If no text was passed, the hint displays the default text loaded
    * in the instantiated object.
    */
   loadHint(hintText){

     if (hintText!=''){
       this.description = hintText;
     }else{
       this.description = this.defaultText;
     }

     //Hints can become a big annoynace when accessing the mobile version
     //as they are being displayed every time you hit a button.
     //Therefore, for mobile version, we deactivate this function.
     if($( window ).width()<950){return;}

     this.trigger.hover((e) => {
       if(e.type == 'mouseenter'){
         this.showHint(e, this.description);
       }else{
         this.hideHint();
       }
     });
     return this.trigger;
   }

   /**
    * Creates a hint following the model provided by the extended
    * object, appends it to the body and calculates the position
    * so it shows next to the trigger element.
    */
   showHint(event, hintText){
     this.hint = this.createHint(hintText);
     $(document.body).append(this.hint);
     this.hint.css('top', getYPosition(this.trigger));
     this.hint.css('left', getXPosition(this.trigger, this.hint.width()));
   }

   /**
    * Removes the hint from the app interface.
    */
   hideHint(){
     this.hint.remove();
   }
 };



 function getXPosition(trigger, hintWidth){

    let result;

    let triggerLeft = trigger.offset().left;
    let safetyMargin = 26;

     if ((triggerLeft + hintWidth) >= $( window ).width()){
         result = triggerLeft - hintWidth + safetyMargin;
     }else{
         result = triggerLeft;
     }
     return result;
   }

 function getYPosition(trigger) {
    let result;
    let triggerTop = trigger.offset().top;
    let safetyHeight = 30;

    result = triggerTop + safetyHeight;
    return result;
 }
