// dependencies
var express = require('express');
var connect = require('connect-ensure-login');

// models
var User = require('../models/user');
var Story = require('../models/story');
var Comment = require('../models/comment');

var router = express.Router();

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
