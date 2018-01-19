// load env variables
require('dotenv').config();

// libraries
const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const socketio = require('socket.io');


// local dependencies
const db = require('./db');
const passport = require('./passport');
const views = require('./routes/views');
const api = require('./routes/api');


// initialize express app
const app = express();

// set POST request body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// enable CORS requests
app.use(cors());

// set up sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
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


// authentication routes with Facebook
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get(
  '/auth/facebook/callback',
  passport.authenticate(
    'facebook',
    { failureRedirect: '/' }
  ),
  function(req, res) {
    res.redirect('/');
  }
);

// authentication routes with MIT OpenID Connect
app.get('/auth/oidc', passport.authenticate('oidc'));
app.get('/auth/oidc/callback', passport.authenticate('oidc', {
  successRedirect: '/',
  failureRedirect: '/'
}));

// authentication routes with Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect home.
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

// configure socketio
const server = http.Server(app);
const io = socketio(server);
app.set('socketio', io);

// port config
const port = process.env.PORT || 3000; // config variable
server.listen(port, function() {
  console.log('Server running on port: ' + port);
});
