/*jshint esversion: 6 */
const addTaksForm = require('./forms/add_task_form');
const leftMenuHandler = require('./menus/left_menu');
const helpHint = require('./hints/help_hint');

//Main task list element
const ol = document.getElementById('mainList');

$(document).ready(function(){

  //Adding new tasks
  $('#formBtn').on('click', function(){

      var item = $('form input');
      var todo = {item: item.val()};

      const secondList = $('#mainList');

      console.log("button clicked");
      console.log(todo);

      $.ajax({
        type: 'POST',
        url: '/',
        data: todo,
        success: function(data){

          secondList.append('<li>' + todo.item + '</li>');
          // for (let i = 0; i<data.length;i++){
          //   secondList.append('<li>' + data[i].item + '</li>');
          // }

          //do something with the data via front-end framework
          //location.reload();
        }
      });
      return false;
  });

  // $('li').on('click', function(){
  //
  //     console.log($(this));
  //     let item = {item: $(this).text()};
  //
  //     $.ajax({
  //       type: 'POST',
  //       url: '/remove',
  //       data: item,
  //       success: function(item){
  //
  //         console.log("listo");
  //         //do something with the data via front-end framework
  //         // location.reload();
  //       }
  //     });
  // });


  ol.addEventListener('slip:beforereorder', function(e){
      if (/demo-no-reorder/.test(e.target.className)) {
          e.preventDefault();
      }
  }, false);

  ol.addEventListener('slip:swipe', function(e){
    console.log(e.detail.direction);
  },false);


  ol.addEventListener('slip:beforeswipe', function(e){
      if (e.target.nodeName == 'INPUT' || /demo-no-swipe/.test(e.target.className)) {
          e.preventDefault();
      }
  }, false);

  ol.addEventListener('slip:beforewait', function(e){
      if (e.target.className.indexOf('instant') > -1)
      e.preventDefault();
  }, false);

  ol.addEventListener('slip:afterswipe', function(e){
      e.target.parentNode.removeChild(e.target);
  }, false);

  ol.addEventListener('slip:reorder', function(e){
      e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
      return false;
  }, false);

  new Slip(ol);


  //User interface elements
  const leftMenuIcon = $('#top_bar_menu_icon');
  const leftMenu = $("#left_menu");
  const content = $("#content");


  // Shows and hides left menu in mobile version.
  leftMenuIcon.on('click', function(){
    if ($( window ).width()<950){
      if(leftMenu.hasClass("show_left_menu")){
        leftMenuHandler.leftMenuHide(leftMenu,content,leftMenuIcon);
      }else{
        leftMenuHandler.leftMenuShow(content,leftMenu,leftMenuIcon);
      }
    }
  });


  // Removes mobile left menu when screen is enlarged to PC size.
  $( window ).resize(function() {
   if($( window ).width()>950 &&  leftMenu.hasClass("show_left_menu")){
     leftMenuHandler.leftMenuHide(leftMenu,content,leftMenuIcon);
   }
});


  // Displays add task form
  $('#top_bar_add_btn').on('click', function(){
      addTaksForm.showModal();
  });


  // Displays hint box when hover elements with hints
  let hintHolders = $('.hintHolder');
  const hintBox = $('.hintBox_frame');
  hintHolders.hover(function(event){
    helpHint.showHint(event,hintBox);
  }, function(event){
    helpHint.hideHint(event,hintBox);
  });


  $(document).keydown(function(e){

    //(q) Opens addtask panel.
    if (e.keyCode == 81){
      e.preventDefault();
      $(document).off('keydown');
      addTaksForm.showModal();

    }
  });


});
