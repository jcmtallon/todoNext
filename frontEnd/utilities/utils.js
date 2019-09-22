const MsgBox = require('./../messageBox/messageBox');
const styles = require('./../cssClassNames/cssClassNames');

/**
 * Various utilities for the application.
 */
class Utilities{
  constructor(){
    this.messenger = new MsgBox();
  }


  /**
   * Returns a true value if the Internet connection is
   * lost, displays an error message and executes a callback
   * (if pased)
   * @return {Boolean}  description
   */
  noConnection(callback){
    if(!navigator.onLine){
      this.messenger.showMsgBox('Failed to perform task.\nCheck if there is an internet connection.','error','down');
      if(callback!=undefined){callback();}
      return true;
    }
  }


  /**
   * Displays input with a highlighted format
   * when the value of the specified field is
   * a valid date.
   * @param  {jquery} field
   */
  highlighWhenValidDate(field, nextField = undefined){
    function isValidDate(date) {
      return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
    }

    let inputDate = new Date(field.val());

    if(isValidDate(inputDate)){
      field.addClass(styles.field.date_field_validDate);
      if (nextField!=undefined) setTimeout( () => {nextField.focus();}, 100);

    }else{
      field.removeClass(styles.field.date_field_validDate);
    }
  }


  getSelectedInputText(items, selected){
    const trues = selected.filter(Boolean).length;
    let text = ' ';
    if(trues > 0){
      if (trues == 1){
        $.each(selected, (index, value)=>{
          if (value == true) {
            text = items[index].title;
            return false;}
        });

      }else{
        let entries = [];
        $.each(selected, (index, value)=>{
          if (value == true) {
            entries.push(items[index].title);
            }
        });
       return entries.join(', ');
      }
    }
    return text;
  }


}

module.exports = new Utilities();
