/*jshint esversion: 6 */
const Point = require('./../models/point');

// Used to extract data from post requests.
const bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended: false});


module.exports = function(app){

  //Gets points by query.
  app.get('/points', urlencodedParser, function(req, res, next){
    Point.findPoints(req.query, res, next);
  });

  // Adds array of tasks into database.
  app.post('/points', urlencodedParser, function(req, res, next){

    let points = JSON.parse(req.body.points);

    Point.savePoints(points, function(err, savedPoints){
      if (err) return next(err);
      console.log(savedPoints);
      res.json(savedPoints);
    });
  });

  // Removes a single point from db.
  app.delete('/points', urlencodedParser, function(req, res, next){

    Point.deleteOnePoint(req.body, function(err, removedPoint){
      if(err) return next(err);
      res.json(removedPoint);
    });
  });

};
