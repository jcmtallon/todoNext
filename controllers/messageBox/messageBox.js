/*jshint esversion: 6 */

module.exports = class MsgBox{
  constructor(){
  }


  /**
   * showMsgBox - temporarily displays a floating message with the color
   * and in the position passed by the caller.
   *
   * @param  {string} msg      Text to display in the floating message box.
   * @param  {string} type     Can be 'error','notice','goal'
   * @param  {string} position Can be 'up', 'down'
   */
  showMsgBox(msg, type, position){

    let targetClass;

    // Set msgbox background color.
    switch (type) {
      case 'error':
        targetClass = 'inner_msgBox_error';
        break;
      default:
        targetClass = 'inner_msgBox';
    }

    // Construct msgbox container
    let msgBoxWrapper = $('<div>', {
      class: 'floating_msgBox',
      id:'floating_msgBox'});

    // If mobile, reduce top value.
    let topDistance = '82px';
    if($(window).width()<950){
      topDistance='27px';
    }

    // Set msbgox position
    if(position=='up'){
      msgBoxWrapper.css('top',topDistance);
    }else{
      msgBoxWrapper.css('bottom','40px');
    }


    // Construct inner div
    let msgBox = $('<div>', {
      class: targetClass,
      text: msg});

    // Append to body
    msgBoxWrapper.append(msgBox);
    $(document.body).append(msgBoxWrapper);

    //Apply animation
    $('#floating_msgBox').hide().fadeIn(800).delay(4000).fadeOut(1000, function(){
      $(this).remove();
    });



  }


};
