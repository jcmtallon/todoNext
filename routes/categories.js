/*jshint esversion: 6 */
const User = require('./../models/user');

// Used to extract data from post requests.
const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){

  // Adds single category to user option category array.
  app.post('/categories', urlencodedParser, function(req, res, next){

    let request = {
      userId: req.body.userId,
      category: JSON.parse(req.body.category)
    };

    User.addCategory(request, function(err, savedCat){
      if (err) return next(err);
      res.json(savedCat);
    });
  });


};
