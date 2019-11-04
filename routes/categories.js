const User = require('./../models/user');

const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended: false});



module.exports = function(app){

  // Adds single category to db.
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
