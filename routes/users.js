const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./../models/user');
const Log = require('./../models/log');

// Used to extract data from post requests.
const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended: false});


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

      // If no error, check if user already exists.
      User.getUserByUsername(username, function(err, user){
        if(err) throw err;
        if(!user){

          // If no username, check is email already exists.
          User.getUserByEmail(email, function(err, user){
            if(err) throw err;
            if(!user){

              // If no exists, create and save user into db.
              let newUser = new User({
                name: name,
                email: email,
                username: username,
                password: password,
                options: {
                  logs: {
                    isFirstSession: true,
                    lastHabitUpdate: new Date(),
                    currentToday: new Date(),
                    fixedPeriods: true
                  },
                  stats:{
                    completedTasks: 0,
                    pendingTasks: 0,
                    comTaskDay: 0,
                    comTaskWeek: 0,
                    comTaskMonth: 0,
                    comTaskBestDay: 0,
                    comTaskBestWeek: 0,
                    comTaskBestMonth: 0,
                    comPointDay: 0,
                    comPointWeek: 0,
                    comPointMonth: 0,
                    comPointBestDay: 0,
                    comPointBestWeek: 0,
                    comPointBestMonth: 0
                  }
                }
              });

              User.createUser(newUser, function(err, user){
                if(err) throw err;
                console.log(user);
              });

              // The redirect to login screen and show success msg.
              req.flash('success_msg', 'You are registered and can now login.');
              res.redirect('/users/login');

            }else{

              // Rerender and show error msg.
              res.render('register', {name: name,
                                      email: email,
                                      username: username,
                                      errors: [{msg:'Email already exists.'}]});


            }
          });

        }else{

          // Rerender and show error msg.
          res.render('register', {name: name,
                                  email: email,
                                  username: username,
                                  errors: [{msg:'Username already exists.'}]});

        }
      });

    }

  });


  // Strategy for login validation.
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


  // Passport serialize, deserialize
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });


  // Logging in
  app.post('/users/login',
    passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
    function(req, res) {
      // res.redirect('/');
      res.render('main');
    });


  // Logging out
  app.get('/users/logout', function(req, res){
    console.log(res.status);
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });


  // Updates target user options with passed modifications.
  app.patch('/users', urlencodedParser, function(req, res, next){

    let request = JSON.parse(req.body.request);

    // Temp solution: todo: remove
    const log = {log: req.body.request, date: new Date()};
    Log.saveLog([log], function(err, savedLog){
      if (err) return next(err);
    });


    User.patchById(req.body.id, request, function(err, updatedUser){
      if (err) return next(err);
      res.send(updatedUser);
    });
  });
};
