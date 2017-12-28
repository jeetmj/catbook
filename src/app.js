// common libraries
var path = require('path');

// webapp specific
var http = require('http');
var bodyParser = require('body-parser');

var express = require('express');
var session = require('express-session');
// use res.sendFile instead of templates
var exphbs = require('express-handlebars');

var socketio = require('socket.io');

// models
var User = require('./models/user');
var Story = require('./models/story');
var Comment = require('./models/comment');

// routes
var views = require('./routes/index');
var api = require('./routes/api');

// Mongoose configs
var db = require('./db');

// Passport configs
var passport = require('./passport');

// initialize express app
var app = express();

// POST request body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// hook up passport and set up sessions
app.use(session({
  secret: 'foo',
  resave: 'false',
  saveUninitialized: 'true'
}));
app.use(passport.initialize());
app.use(passport.session());

// authentication routes
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {

  res.redirect('/');
});

// set static path for public
app.use('/static', express.static('public'));

// set view and api routes
app.use('/', views);
app.use('/api', api);

// 404 route
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// route error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    status: err.status,
    message: err.message,
  });
});


// port config
var port = process.env.PORT || 3000; // config variable
var server = http.Server(app);
server.listen(port, function() {
  console.log('Server running on port: ' + port);
});

// socketio configurations
var io = socketio(server);

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('disconnect', function() {
    console.log('a user disconnected');
  });
});
