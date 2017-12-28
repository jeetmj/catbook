// dependencies
var express = require('express');
var connect = require('connect-ensure-login');

// models
var User = require('../models/user');
var Story = require('../models/story');
var Comment = require('../models/comment');


var router = express.Router();

// public endpoints
router.get('/', function(req, res, next) {
  res.redirect('/feed');
});

router.get('/login', function(req, res, next) {
  if(req.isAuthenticated()) {
    res.redirect('/u/'+req.user.fbid+'/profile');
  } else {
    res.sendFile('login.html', {root: 'src/views'});
  }
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

router.get('/feed', function(req, res) {
  res.sendFile('feed.html', {root: 'src/views'});
});

router.get('/u/:fbid/profile', function(req, res) {
  res.sendFile('profile.html', {root: 'src/views'});
});


module.exports = router;
