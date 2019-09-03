const PagingButtons = require('./pageBtns');
const MsgBox = require('./../messageBox/messageBox');
const icons = require('./../icons/icons.js');

module.exports = class ListView{
  constructor(){
    this._messanger = new MsgBox();
    this.listContainer = getListContainer();
    this.icons = icons;
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
   * Hightlights last item and scrolls to make sure it
   * shows in view.
   */
  hightlightByInstantId(instantId){
    this.list.children().each(function(){
      if($(this).attr('data-instantId')==instantId && instantId!=undefined){
        // Painting highlight
        $(this).animate({backgroundColor: "#fff4bf"}, 500 )
        .animate({backgroundColor: 'white'}, 4000 );

        // Scroll with correction to avoid that the new task shows behind the top bar.
        $(this).get(0).scrollIntoView();
        if(window.scrollY != (document.body.offsetHeight-window.innerHeight)){
          window.scrollBy(0, -200);}
        return;
      }
    });
  }


  /**
   * Returns a div populated with buttons for the
   * number of pages indicated and also button for the
   */
  getPagingBtns(pages, currentPage, refresh){
    let btns = new PagingButtons(pages, currentPage, refresh);
    let btnContainer = btns.getButtons();
    return btnContainer;
  }


  buildEmptyAlert(message, icon) {

    let iconColor = '#f2f2f2';
    let msgColor = '#dedede';

    let bigIcon;
    bigIcon = icon(iconColor);
    bigIcon.css({'width' : '23%',
                'margin-top' : '100px'});

    let msg;
    msg = $('<div>',{});
    msg.html(message);
    msg.css({'color' : msgColor,
             'font-size' : '25px',
             'margin-top' : '8px',
             'white-space' : 'pre-line',
             'font-style' : 'italic'});

    let container;
    container = $('<div>',{});
    container.css({'width' : '100%',
                   'text-align' : 'center'});

    //Mobile styles
     if($( window ).width()<950){
       msg.css({'font-size' : '5.5vw'});
       bigIcon.css({'margin-top' : '125px'});
     }

    container.append(bigIcon).append(msg);
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
