 /**
  * Class properties
  *  - element
  *  - msg
  */


 /**
  * Css classes
  */
 const elementClass = 'flash-msg__wrapper';
 const innerClass = 'flash-msg__inner';
 const plainClass = 'flash-msg__inner--plain';
 const alertClass = 'flash-msg__inner--alert';
 const fadeInClass = 'animated flashAnimation';


/**
 * Types
 */
const plain = 'plain';
const alert = 'alert';


class FlashMsg{

  // Blue background msg.
  showPlainMsg(text, height){
    this._removePrevMsgs();
    this._buildElement(text);
    this._addModifier(plain);
    this._positionElement(height);
    this._render();
  }

  // Red background msg.
  showAlertMsg(text, height){
    this._removePrevMsgs();
    this._buildElement(text);
    this._addModifier(alert);
    this._positionElement(height);
    this._render();
  }




  //------------------------ Private ---------------------------//

  _removePrevMsgs(){
      $('.' + elementClass).remove();
  }

  _buildElement(text){
    this.msg = $('<div>', {text: text, class: innerClass});
    this.element = $('<div>', {class: elementClass}).append(this.msg);
  }

  _addModifier(type){
    switch (type) {
      case alert:
        this.msg.addClass(alertClass);
        break;
        default:
        this.msg.addClass(plainClass);

    }
  }

  _positionElement(height){
    if (height!=undefined) {
      this.element.css('top', height);
    }else{
      this.element.css('bottom', '40px');
    }

    this.element.css('left', $(window).width()/2);
  }

  _render(){
    $(document.body).append(this.element);
    this.element.addClass(fadeInClass);
  }
}


 module.exports = new FlashMsg();
