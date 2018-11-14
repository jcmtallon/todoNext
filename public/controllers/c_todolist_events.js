/*jshint esversion: 6 */

//Loading the list
const ol = document.getElementById('mainList');


$(document).ready(function(){

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




});
