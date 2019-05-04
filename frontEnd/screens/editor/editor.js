/*jshint esversion: 6 */

let editor;

class Editor{
  constructor(){
  }


  /**
   * clearContents - Removes existing elements
   * from the editor.
   */
  clearContents(){
    editor = $('#editor');
    editor.empty();
  }


  /**
   * setTitle - Appends a title element to the editor
   * that displays the passed String.
   * @param  {String} titleText Title to display
   */
  setTitle(titleText){
    let title = $('<div>', {
      class:'view_top_title',
      text:titleText});

    editor.append(title);
  }



  /**
   * insertContext - Appends a jquery element to the editor
   * that will be used as a container for a page.
   * @param  {Jquery} content
   */
  insertContents(content){
    editor.append(content);
  }

}


module.exports = new Editor();
