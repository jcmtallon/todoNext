/*jshint esversion: 6 */

$(document).ready(function(){

  $('#formBtn').on('click', function(){

      var item = $('form input');
      var todo = {item: item.val()};

      const secondList = $('#secondList');

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

  $('li').on('click', function(){

      console.log($(this));
      let item = {item: $(this).text()};

      $.ajax({
        type: 'POST',
        url: '/remove',
        data: item,
        success: function(item){

          console.log("listo");
          //do something with the data via front-end framework
          // location.reload();
        }
      });
  });

});
