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
    res.render('login', { user: req.user });
  }
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

router.get('/feed', function(req, res) {
  res.render('feed', { user: req.user });
});

router.get('/u/:fbid/profile', function(req, res) {
  res.render('profile', { username: req.params.fbid, user: req.user });
});


// api endpoints
router.get('/story', function(req, res) {
  Story.findOne({ _id: req.query.id }, function(err, story) {
    res.send(story);
  });
});

router.get('/stories', function(req, res) {
  Story.find({}, function(err, stories) {
    res.send(stories);
  });
});

router.post(
    '/story',
    connect.ensureLoggedIn(),
    function(req, res) {
  var newStory = new Story({
    'owner': req.user._id,
    'message': req.body.message,
  });
  newStory.save(function(err) {
    if (err) console.log(err);
  });

  res.redirect('/u/'+req.user.fbid+'/profile');
});

router.get('/comment', function(req, res) {
  Comment.find({ parent: req.query.parent }, function(err, comments) {
    res.send(comments);
  })
});

router.post(
    '/comment',
    connect.ensureLoggedIn(),
    function(req, res) {
  var newComment = new Comment({
    'owner': req.user._id,
    'parent': req.body.parent,
    'message': req.body.message,
  });
  newComment.save(function(err) {
    if (err) console.log(err);
  });

  res.redirect('/u/'+req.user.fbid+'/profile');
});


module.exports = router;
