/*jshint esversion: 6 */

/** @Module
 * Display hints when hovering elements in the ui that use specif css classes.
 */

let elementsWithHints;
let hintBox;



/**
 * @Class
 * In charge of adding, displaying and hidding hints to
 * the different elements of the user interface.
 */
class Hints{
  constructor(){}



  /**
   * loadHints - Identifies the elements that need a hint
   * to be displayed and adds the necessary hover event to
   * those elements.
   *
   * @param  {string} targetElements ex. '.modal_addTask_body_icons_col .hintHolder'
   */
  loadHints(targetElements){

    elementsWithHints = $(targetElements);
    hintBox = $('.hintBox_frame');

    elementsWithHints.hover((e) => {
      if(e.type=='mouseenter'){
        showHint(e);
      }else{
        hideHint();
      }

    });
  }

  hideHints(){
    hintBox = $('.hintBox_frame');
    hideHint();
  }

}


/**
 * showHint - Finds the position of the hovered element
 * and displayes the correspnding hint to that element
 * next to it.
 * @private
 * @param  {Object} e hover jquery event
 */
function showHint (e){

      //Hints can become a big annoynace when accessing the mobile version
      //as they are being displayed every time you hit a button.
      //Therefore, for mobile version, we deactivate this function.
      if($( window ).width()<950){return;}

      let targetId = e.currentTarget.id;
      let hintText = hintMatcher(targetId);

      let hintTextContainer = $('<div>', {
        class:'hintBoxContent',
        text: hintText});

      let iconHeightInPixels = 25;
      let xPosition = calculateXValue($('#' + targetId).offset().left);
      let yPosition = $('#' + targetId).offset().top + iconHeightInPixels - window.scrollY;

      hintBox.append(hintTextContainer);
      hintBox.css('display','block');
      hintBox.css('top', yPosition);
      hintBox.css('left', xPosition);

      //So the hint is removed as soon as the document is clicked.
      $(document).on({
        'click.hintClick': ()=>{
          hideHint();
          $(document).off('click.hintClick');
        }
      });
  }



/**
 * hideHint - Hides all hintBoxes displayed at the
 * moment this function is executed
 */
function hideHint (){
      $('.hintBoxContent').remove();
      hintBox.css('display','none');
    }



/**
 * calculateXValue - Calculates the necessary x position
 * for the hintbox so it is never displayed out of the screen.
 *
 * @param  {Number} targetPosition ex. 520
 * @return {Number}
 */
function calculateXValue(xPosition){

    let result = xPosition;

    //200 is the max width of the hintBox
    if ((xPosition + 200) > $( window ).width()){
        result = result-((xPosition + 200) - $( window ).width()-26);
    }else{
        // IMPORTANT: Due to an unknown issue, hint boxes always show up around
        // 120px sepparated from where they should show up.
        // I added this line as my last resource in order to be able to fix the problem.
        result = result-120;
    }

    return result;
  }



  /**
   * hintMatcher - Gets the corresponding hint message for
   * the passed ui element id
   *
   * @param  {String} id ex. 'top_bar_menu_icon_container'
   * @return {String}    hint mesage
   */
  function hintMatcher(id){

    switch (id) {
      case 'top_bar_add_btn': return 'Add new tasks and habits. [q]';
      case 'top_bar_calendar_btn': return 'Check out your month situation!';
      case 'top_bar_stats_btn': return 'See how you have been performing!';
      case 'top_bar_account_btn': return 'Manage your account like a boss!';
      case 'modal_addTask_categoryIcon': return 'Assing a category to this item [c#]';
      case 'modal_addTask_projectIcon': return 'Include this task inside a project [p#]';
      case 'modal_addTask_priorityIcon': return 'Select the urgency level of this item [u#]';
      case 'modal_addTask_learningIcon': return 'Add this item to your list of learnt things [l#]';
      case 'modal_addTask_hoursIcon': return 'Estimate how many hours this item will take to complete to get more accurate stats later! [h#]';
      case 'setting-form_fixed-periods': return 'If deactivated, the next task for a habit is added to the list the following day as soon as the previous task is marked as completed.';
      default: return 'Error: No hint found';
    }
  }

  module.exports = new Hints();
