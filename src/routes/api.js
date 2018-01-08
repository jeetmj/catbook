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
  if (req.isAuthenticated()){
    res.send(req.user);
  }
  else{
    res.send({});
  }
});

router.get('/user', function(req, res) {
  User.findOne({ _id: req.query._id }, function(err, user) {
    res.send(user);
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
    User.findOne({ _id: req.user._id },function(err,user) {
      const newStory = new Story({
        'creator_id': user._id,
        'creator_name': user.name,
        'content': req.body.content,
      });

      user.set({ last_post: req.body.content });
      user.save(); //this is OK! the lines below this don't rely on the state of the user, so they don't have to be shoved in a callback.

      newStory.save(function(err,story) {
        // configure socketio
        const io = req.app.get('socketio');
        io.emit("post", {
          _id: story._id,
          creator_id: user._id,
          creator_name: user.name,
          content: req.body.content
        });

        if (err) console.log(err);
      });

      res.send({});
    });
  }
);

router.get('/comment', function(req, res) {
  Comment.find({ parent: req.query.parent }, function(err, comments) {
    res.send(comments);
  })
});

router.post(
  '/comment',
  connect.ensureLoggedIn(),
  function(req, res) {
    User.findOne({ _id: req.user._id }, function (err, user) {
      const newComment = new Comment({
        'creator_id': user._id,
        'creator_name': user.name,
        'parent': req.body.parent,
        'content': req.body.content,
      });

      newComment.save(function(err, comment) {
        if (err) console.log(err);

        const io = req.app.get('socketio');
        io.emit("comment", {
          _id: comment._id,
          creator_id: user._id,
          creator_name: user.name,
          parent: req.body.parent,
          content: req.body.content
        });
      });

      res.send({});
    });
  }
);
module.exports = router;
