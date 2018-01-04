// dependencies
const express = require('express');
const connect = require('connect-ensure-login');

// models
const User = require('../models/user');
const Story = require('../models/story');
const Comment = require('../models/comment');

const router = express.Router();

// api endpoints
router.get('/whoami', function(req, res) {
  res.send(req.isAuthenticated() ? req.user : {});
});

router.get('/user', function(req, res) {
  User.findOne({ _id: req.query.id }, function(err, user) {
    res.send(user);
  });
})

router.get('/story', function(req, res) {
  Story.findOne({ _id: req.query.id }, function(err, story) {
      User.findOne({_id:story.owner},function(err,owner)
      {
          res.send({_id:owner.id,owner:owner.name,message:story.message});
      })
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
      const newStory = new Story({
        'owner': req.user._id,
        'message': req.body.message,
      });
      newStory.save(function(err) {
          // configure socketio
          const io = req.app.get('socketio');
          User.findOne({_id:req.user._id},function(err,owner)
          {
              io.emit("post",{_id:owner.id,owner:owner.name,message:req.body.message});
          });
        if (err) console.log(err);
      });

      res.send({});
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
  const newComment = new Comment({
    'owner': req.user._id,
    'parent': req.body.parent,
    'message': req.body.message,
  });
  newComment.save(function(err) {
    if (err) console.log(err);
    const io = req.app.get('socketio');
    io.emit("comment",{owner:req.user._id ,parent: req.body.parent, message:req.body.message});
  });

  res.send({});
});

module.exports = router;

