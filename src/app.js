// libraries
const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');


// local dependencies
const db = require('./db');
const passport = require('./passport');
const views = require('./routes/views');
const api = require('./routes/api');


// initialize express app
const app = express();

// configure socketio
const socketio = require('socket.io');
const server = http.Server(app);
const io = socketio(server);
app.set('socketio', io);

// set POST request body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// set up sessions
app.use(session({
  // TODO: fix secret
  secret: 'foo',
  resave: 'false',
  saveUninitialized: 'true'
}));


// hook up passport
app.use(passport.initialize());
app.use(passport.session());


// set routes
app.use('/', views);
app.use('/api', api );
app.use('/static', express.static('public'));

// authentication routes
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get( '/auth/facebook/callback', passport.authenticate(
      'facebook', { failureRedirect: '/' }), function(req, res) {
  res.redirect('/');
});

// 404 route
app.use(function(req, res, next) {
  const err = new Error('Not Found');
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
const port = process.env.PORT || 3000; // config variable
// const server = http.Server(app); use same server variable we have above
server.listen(port, function() {
  console.log('Server running on port: ' + port);
});


