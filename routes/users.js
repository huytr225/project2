var express = require('express');
var passport=require('passport');
var User = require('../models/user');
var Ride = require('../models/ride');
var async = require('async');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test',isLoggedIn, function(req, res, next) {
  res.send(req.user);
});


router.get('/offered/:user', function(req, res, next) {
  var offered = [];
  User.findOne({ 'local.email': req.params.user }, function(err, user) {
      async.forEach(user.rides.offered, function(id,callback) {
        Ride.findById(id, function(error, ride) {
              offered.push(ride);
              callback();
          });
        }, function(err) {
          if(err) console.log(err);
          else res.send(offered);
        });
  });
});

router.get('/booked/:user', function(req, res, next) {
  var booked = [];
  User.findOne({ 'local.email': req.params.user }, function(err, user) {
      async.forEach(user.rides.booked, function(id,callback) {
        Ride.findById(id, function(error, ride) {
              booked.push(ride);
              callback();
          });
        }, function(err) {
          if(err) console.log(err);
          else res.send(booked);
        });
  });
});

router.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
})

router.post('/signup', function(req, res, next){
    passport.authenticate('local-signup', function(err, user, info) {
      if (err) { return next(err) }
      if (!user) { return res.json( { message: info.message }) }
      req.login(user, function (err) {
          if(err) {
            console.log(err);
            return;
          }
          res.json(user);
      });
    })(req, res, next);
});

router.post('/login', function(req, res, next){
    passport.authenticate('local-login', function(err, user, info) {
      if (err) { return next(err) }
      if (!user) { return res.json({ message: info.message }) }
      req.login(user, function (err) {
          if(err) {
            console.log(err);
            return;
          }
          res.json(user);
      });

    })(req, res, next);
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }

  res.redirect('/users/');
}

module.exports = router;
