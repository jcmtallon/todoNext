const Point = require('./../models/point');

const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended: false});



module.exports = function(app){

  //Fetches matching points.
  app.get('/points', urlencodedParser, function(req, res, next){
    Point.findPoints(req.query, res, next);
  });



  //Adds new points to database
  app.post('/points', urlencodedParser, function(req, res, next){
    let points = JSON.parse(req.body.points);
    Point.savePoints(points, function(err, savedPoints){
      if (err) return next(err);
      res.json(savedPoints);
    });
  });



  // Removes single point from db.
  app.delete('/points', urlencodedParser, function(req, res, next){
    Point.deleteOnePoint(req.body, function(err, removedPoint){
      if(err) return next(err);
      res.json(removedPoint);
    });
  });

};
