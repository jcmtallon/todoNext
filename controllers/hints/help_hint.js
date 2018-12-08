/*jshint esversion: 6 */

//Displays a hint next to the target element.
exports.showHint = function(e,hintBox){

    let hint = hintMatcher(e.target.id);
    let hintContent = $('<div>', {
      class:'hintBoxContent',
      text: hint});

    let xPosition = calculateXPosition(e.target.x);
    let yPosition = e.target.y + e.target.height;

    hintBox.append(hintContent);
    hintBox.css('display','block');
    hintBox.css('top', yPosition);
    hintBox.css('left', xPosition);

};


//Hides and resets hint
exports.hideHint = function(e,hintBox){
    $('.hintBoxContent').remove();
    hintBox.css('display','none');};


//Calculates x position so the hintbox is never shown out of the screen.
function calculateXPosition(targetPosition){

  let result = targetPosition;

  //200 is the max width of the hintBox
  if ((targetPosition + 200) > $( window ).width()){
      result = result-((targetPosition + 200) - $( window ).width()-26);
  }else{
      // IMPORTANT: Due to an unknown issue, hint boxes always show up around
      // 120px sepparated from where they should show up.
      // I added this line as my last resource in order to be able to fix the problem.
      result = result-120;
  }

  return result;
}


//Finds the corresponding hint message.
function hintMatcher(id){

  switch (id) {
    case 'top_bar_add_btn': return 'Add new tasks and habits. [q]';
    case 'top_bar_stats_btn': return 'See your performance in numbers!';
    case 'top_bar_account_btn': return 'Manage your account like a boss!';
    case 'modal_addTask_categoryIcon': return 'Assing a category to this item [c.]';
    case 'modal_addTask_projectIcon': return 'Include this task inside a project [p.]';
    case 'modal_addTask_priorityIcon': return 'Select the urgency level of this item [u.]';
    case 'modal_addTask_learningIcon': return 'Add this item to your list of learnt things [l.]';
    case 'modal_addTask_hoursIcon': return 'Estimate how many hours this item will take to complete to get more accurate stats later! [h.]';
    default: return 'Error: No hint found';
  }
}
