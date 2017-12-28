// dependencies
const express = require('express');
const connect = require('connect-ensure-login');

// models
const User = require('../models/user');
const Story = require('../models/story');
const Comment = require('../models/comment');


const router = express.Router();

// public endpoints
router.get('/', function(req, res, next) {
  res.sendFile('index.html', {root: 'src/views'});
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
  res.redirect('/');
});

router.get('/u/:fbid/profile', function(req, res) {
  res.sendFile('profile.html', {root: 'src/views'});
});


module.exports = router;
