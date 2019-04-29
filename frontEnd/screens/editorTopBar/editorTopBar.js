/*jshint esversion: 6 */


let topBar;

class EditorTopBar{
  constructor(){}

  /**
   * clearContents - Removes all elements from bar.
   */
  clearContents(){
    topBar = $('#content_top_bar');
    topBar.empty();
  }


  /**
   * Adds btn to bar.
   * @param  {Object} btn {id:'xxx', text:'xxx', action:function(){}}
   */
  addButon(btn){

    let button = $('<div>', {
      id: btn.id,
      text: btn.text});
    button.attr("class","btn_filter_bar");
    button.on('click', btn.action);

    let container = $('<div>', {
      class:'topBar_btnContainer'});

    container.append(button);
    topBar.append(container);
  }


}

module.exports = new EditorTopBar();
