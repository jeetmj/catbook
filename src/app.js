/**
 *  Dependencies
 */

// common libraries
var path = require('path');

// webapp specific
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var session = require('express-session');
var passport = require('passport');
var fbp = require('passport-facebook');

// models
var User = require('./models/user');
var Story = require('./models/story');
var Comment = require('./models/comment');

// routes
var routes = require('./routes/index');


/**
 *  Mongo Configurations
 */

// set up mongoDB connection
var mongoDB = 'mongodb://admin:password@ds121535.mlab.com:21535/catbookdb'; // config variable
var mongooseOptions = {
  useMongoClient: true
};
mongoose.connect(mongoDB, mongooseOptions);
mongoose.Promise = global.Promise;
var db = mongoose.connection;

// db error handling
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


/**
 *  Passport Configurations
 */

// set up passport configs
passport.use(new fbp.Strategy({
  clientID: "124533098186894", // config variables
  clientSecret: "240eb909b6c01098a18f7ec01c63a66d",
  callbackURL: "http://localhost:3000/auth/facebook/callback"
}, function(accessToken, refreshToken, profile, done) {
  User.findOne({
    'fbid': profile.id
  }, function(err, user) {
    if (err) { return done(err); }
    if (!user) {
      user = new User({
        name: profile.displayName,
        fbid: profile.id
      });
      user.save(function(err) {
        if (err) console.log(err);
        return done(err, user);
      });
    } else {
      return done(err, user);
    }
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


/**
 * Express configurations
 */

// initialize express app
var app = express();

// POST request body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  extname: '.hbs',
  partialsDir: path.join(__dirname, 'views/partials/'),
}));
app.set('view engine', 'hbs');

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
app.use('/', routes);

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
app.listen(port, function() {
  console.log('Server running on port: ' + port);
});
