
module.exports = function(app){

  //Renders the main view
  app.get('/', ensureAuthenticated, function(req, res){
      res.render('main_view');
  });

  function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('users/login');
  }
}

};
