/*jshint esversion: 6 */
const PagingButtons = require('./pageBtns');


module.exports = class ListView{
  constructor(){
    this.listContainer = getListContainer();
  }

  /**
   * Hides and applies a quick fade in effect
   * to the category list.
   */
  fadeInList(){
    this.list.hide().fadeIn(800);
  }


  /**
   * Hightlights last item and scrolls to make sure it
   * shows in view.
   */
  highlightLastItem(){

    let nbOfChildren = this.list.children().length;
    let listItem = this.list.children().eq(nbOfChildren-1);

    listItem.animate({backgroundColor: "#fff4bf"}, 500 )
    .animate({backgroundColor: 'white'}, 4000 );

    window.scrollTo(0,document.body.scrollHeight);
  }


  /**
   * Returns a div populated with buttons for the
   * number of pages indicated and also button for the
   */
  loadPagingButtons(pages, currentPage){
    let btns = new PagingButtons(pages, currentPage, this.refreshMethod);
    let btnContainer = btns.getButtons();
    return btnContainer;
  }


  buildEmptyAlert(message, icon) {

    let iconColor = '#f2f2f2';
    let msgColor = '#dedede';

    let bigIcon;
    bigIcon = icon(iconColor);
    bigIcon.css({'width' : '23%',
                'margin-top' : '80px'});

    let msg;
    msg = $('<div>',{text: message});
    msg.css({'color' : msgColor,
             'font-size' : '25px',
             'margin-top' : '15px'});

    if($( window ).width()<950){
      msg.css({'font-size' : '6vw'});
    }

    let container;
    container = $('<div>',{});
    container.css({'width' : '100%',
                   'text-align' : 'center'});

    container.append(bigIcon)
             .append(msg);

    return container;
  }


};


function getListContainer(){
  let ol = $('<ol>', {
    tabindex:'0',
    class: 'stdListContainer'
  });
  return ol;
}
