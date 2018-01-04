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
});

router.get('/story', function(req, res) {
  Story.findOne({ _id: req.query.id }, function(err, story) {
      User.findOne({_id:story.id},function(err,creator)
      {
          res.send({creator_id:creator.id,creator_name:creator.name,content:story.content});
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
    User.findOne({_id:req.user._id},function(err,poster) {
      const newStory = new Story({
        'creator_name' : poster.name,
        'content': req.body.content,
      });
      newStory.save(function(err,story) { //todo refactor story name
        // configure socketio
        const io = req.app.get('socketio');
        io.emit("post",{_id:story.id,creator_name:poster.name,content:req.body.content});
        if (err) console.log(err);
      });
      res.send({});
    });
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
      User.findOne({_id: req.user._id}, function (err, commenter) {
        const newComment = new Comment({
          'creator_name':commenter.name,
          'parent': req.body.parent,
          'content': req.body.content,
        });
        newComment.save(function(err,comment) {
          if (err) console.log(err);
          const io = req.app.get('socketio');
          io.emit("comment",{_id:comment.id,creator_name:commenter.name, parent: req.body.parent, content:req.body.content});
        });
        res.send({});
      });
    });
module.exports = router;

