

/**
 * Display and remove a css loader animation element from the screen.
 */
class Loader{

  displayLoader(){
    let loader = $('<div>', {id: 'loader', class: 'loader loader--position'});
    let background = $('<div>', {id: 'loaderBg', class: 'modal_blackBackground'});
    $(document.body).append(background.append(loader));
  }

  removeLoader(){
    $('#loaderBg').remove();
  }
}

module.exports = new Loader();
