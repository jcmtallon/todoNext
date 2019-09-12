/**
 * Represents the combination of available paging buttons for
 * a given list view..
 */

 module.exports = class PagingButtons{
   constructor(nbOfPages, currentPageNb, refresh){
     this.NbOfPages = nbOfPages;
     this.currentPageNb =  (currentPageNb != undefined) ? currentPageNb : 1;
     this.refresh = refresh;
   }

   getButtons(){
     let emptyContainer = buildContainer();
     this.container = addButtons(this, emptyContainer);
     if (this.NbOfPages>1){
       return this.container;
     }else{
       return;
     }
   }


 };

 function buildContainer() {
   let container = $('<div>', {});
   container.css({
     'width' : '100%',
     'transform' : 'translate(-10px, 0px)',
     'overflow' : 'hidden',
   });
   return container;
 }




 function addButtons(obj, container) {
   let firstBtnNb = getFirstBtnNb(obj.NbOfPages, obj.currentPageNb);
   let lastBtnNb = getLastBtnNb(obj.NbOfPages, obj.currentPageNb);

   container.append(buildRightArrow(obj.NbOfPages, obj.currentPageNb, obj.refresh));

   for (let i=lastBtnNb; i>=firstBtnNb; i--){
     container.append(buildBtn(i, obj.currentPageNb, obj.refresh));
   }

   container.append(buildLeftArrow(obj.currentPageNb, obj.refresh));

   return container;
 }



 function getFirstBtnNb(pages, current) {
   let number;
   number = (current > 3 && pages > 5) ? current - 2 : 1;
   number = (current > 3 &&  current > pages - 2) ? pages - 4 : number;
   return number;
 }



 function getLastBtnNb(pages, current) {
   let number;
   if (pages > 5 && current < pages - 2){
     number = (current > 3) ? current + 2 : 5;
   }else{
     number = pages;
   }
   return number;
 }



 function buildBtn(btnNb, selectedNb, refresh) {

   let span = $('<span>', {text:btnNb});

   // common styles
   span.css({
     'border-radius' : '3px',
     'padding': '1px 8px',
     'text-decoration' : 'none !important',
     'display': 'block',
     'text-align' : 'center',
     'font-weight' : 'bold',
     'cursor': 'pointer',
     'background-color' : '#263e65',
     'color' : 'white'
   });

   // Selected styles
   if (btnNb == selectedNb) {
     span.css({
       'font-weight' : 'norma;',
       'background-color' : '#dddddd',
       'color' : '#263e65',
       'cursor': 'auto'
     });
   }

   // hover hightlight
   if (btnNb != selectedNb) {
     span.hover(
       () => {span.css('background-color','#3e5c8d');},
       () => {span.css('background-color','#263e65');}
     );
   }

   let btn;
   btn = $('<div>', {});
   btn.append(span);
   btn.css({
    'min-width' : '26px',
    'max-width' : '30px',
    'margin' : '0px 2px',
    'float' : 'right'
   });

   // Click Event
   btn.click(()=>{
     refresh(btnNb);
   });

   return btn;
 }


 function buildLeftArrow(btnNb, refresh) {

   if (btnNb>1){

     let span = $('<span>', {text:'<'});

     // common styles
     span.css({
       'border-radius' : '3px',
       'padding': '1px 8px',
       'text-decoration' : 'none !important',
       'display': 'block',
       'text-align' : 'center',
       'font-weight' : 'bold',
       'cursor': 'pointer',
       'background-color' : '#263e65',
       'color' : 'white'
     });

     // hover style
     span.hover(
       () => {span.css('background-color','#3e5c8d');},
       () => {span.css('background-color','#263e65');}
     );


     let btn;
     btn = $('<div>', {});
     btn.append(span);
     btn.css({
      'min-width' : '26px',
      'max-width' : '30px',
      'margin' : '0px 2px',
      'float' : 'right'
     });

     // Click Event
     btn.click(()=>{
       refresh(btnNb-1);
     });

     return btn;

   }
 }

 function buildRightArrow(pages, btnNb, refresh) {

   if (btnNb<pages){

     let span = $('<span>', {text:'>'});

     // common styles
     span.css({
       'border-radius' : '3px',
       'padding': '1px 8px',
       'text-decoration' : 'none !important',
       'display': 'block',
       'text-align' : 'center',
       'font-weight' : 'bold',
       'cursor': 'pointer',
       'background-color' : '#263e65',
       'color' : 'white'
     });

     // hover style
     span.hover(
       () => {span.css('background-color','#3e5c8d');},
       () => {span.css('background-color','#263e65');}
     );


     let btn;
     btn = $('<div>', {});
     btn.append(span);
     btn.css({
      'min-width' : '26px',
      'max-width' : '30px',
      'margin' : '0px 2px',
      'float' : 'right'
     });

     // Click Event
     btn.click(()=>{
       refresh(btnNb+1);
     });

     return btn;

   }

 }
