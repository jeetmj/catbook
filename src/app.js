// import node modules
var express = require('express');
var mongoose = require('mongoose');

// initialize express app
var app = express();

// set up mongoDB connection
var mongoDB = 'mongodb://admin:password@ds113785.mlab.com:13785/catbookdb'; // config variable
var mongooseOptions = {
  useMongoClient: true
};
mongoose.connect(mongoDB, mongooseOptions);
var db = mongoose.connection;

// db error handling
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// set static path for public
app.use('/static', express.static('public'));

// routes
app.get('/', function(req, res, next) {
  res.send('Hello World');
});

// 404
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
    error: err,
    message: err.message,
  });
});

// port config
var port = process.env.PORT || 3000; // config variable
app.listen(port, function() {
  console.log('Server running on port: ' + port);
});
