/*jshint esversion: 6 */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./../models/user');


module.exports = function(app){

  // Login
  app.get('/users/login', function(req, res){
      res.render('login');
  });

  // Register
  app.get('/users/register', function(req, res){
      res.render('register', {name:'',
                              email: '',
                              username: '',
                              errors:''});
  });

  // Register new user
  app.post('/users/register', function(req, res){
    let name = req.body.name;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let password2 = req.body.password2;

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();

    // If errors, re-render the screen displaying the errors and without
    // losing the user input.
    if(errors){

      res.render('register', {name:name,
                              email: email,
                              username: username,
                              errors:errors});
    }else{

      // If no errors, create and save user into db.
      let newUser = new User({
        name: name,
        email: email,
        username: username,
        password: password
      });

      User.createUser(newUser, function(err, user){
        if(err) throw err;
        console.log(user);
      });

      // The redirect to login screen and show success msg.
      req.flash('success_msg', 'You are registered and can now login.');
      res.redirect('/users/login');
    }

  });



  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.getUserByUsername(username, function(err, user){
        if(err) throw err;
        if(!user){
          return done(null, false, {message: 'Unknown User'});
        }

        User.comparePassword(password, user.password, function(err, isMatch){
          if (err) throw err;
          if(isMatch){
            return done(null, user);
          }else{
            return done(null, false, {message: 'Invalid password'});
          }
        });
      });
    }
  ));


  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });


  app.post('/users/login',
    passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
    function(req, res) {
      res.redirect('/');
    });


  app.get('/users/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });

};
