var express = require('express');
var passport=require('passport');
var User = require('../models/user');
var Ride = require('../models/ride');


var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

  res.send('respond with a resource');
});
router.get('/test',isLoggedIn, function(req, res, next) {
  res.send(req.user);
});

router.get('/find/:src/:des', function(req, res, next){
  var src = req.params.src;
  var des   = req.params.des;
  var rides = [];
  Ride.find({}, function(error, ride) {
      for(var i = 0; i < ride.length; i++){
        if(src == ride[i].src && des == ride[i].des)
          rides.push(ride[i]);
      }

      res.json(rides);
  });
});

router.get('/find/:id', function(req, res, next){
  var id = req.params.id;
  Ride.findById(id, function(error, ride) {
      res.json(ride);
  });
});

router.post('/book', function(req, res, next){
  Ride.findById(req.body.rideid, function(error, ride) {
      ride.numOfSeat = ride.numOfSeat - 1;
      ride.save(function(err){
        if(err) throw err;
      });
  });

  User.findOne({ 'local.email': req.body.passenger }, function(err, user) {
      user.rides.booked.push(req.body.rideid);
      user.save(function(err){
        if(err) throw err;
      });
  });

});

router.post('/offer', function(req, res, next){

  var newRide = new Ride();
  newRide.src = req.body.src;
  newRide.des = req.body.des;
  newRide.date = req.body.date;
  newRide.price = req.body.price;
  newRide.numOfSeat = req.body.numOfSeat;
  newRide.owner.name = req.user.local.email;
  newRide.owner.id = req.user._id;
  newRide.detail.luggage = req.body.lug;
  newRide.detail.note = req.body.note;
  newRide.detail.luggage = req.body.luggage;
  newRide.detail.flexibility = req.body.flexibility;
  newRide.detail.detour = req.body.detour;
  newRide.save(function(err, ride) {
    if (err)
      throw err;
    User.findOne({ 'local.email':  ride.owner.name }, function(err, user) {
        user.rides.offered.push(ride._id);
        user.save(function(err){
          if(err) throw err;
        });
    });
    res.json(ride);
  });

});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }

  res.redirect('/');
}

module.exports = router;
