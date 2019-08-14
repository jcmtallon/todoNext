const User = require('./../models/user');

const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){

  // Adds single category to user option category array.
  app.post('/habits', urlencodedParser, function(req, res, next){

    let request = {
      userId: req.body.userId,
      habit: JSON.parse(req.body.habit)
    };

    User.addHabit(request, function(err, savedUser){
      if (err) return next(err);
      res.json(savedUser);
    });
  });

  // Receives an user id and a habit id, finds the corresponding
  // habit in the habit array of the user option object
  // and removes the habit from the array.
  app.delete('/habits', urlencodedParser, function(req, res, next){

  User.removeHabit(req.body, function(err, options){
    if (err) return next(err);
    res.send(options);
    });
  });


};
