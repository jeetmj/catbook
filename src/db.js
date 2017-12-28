var mongoose = require('mongoose');

// set up mongoDB connection
var mongoURL = 'mongodb://admin:password@ds121535.mlab.com:21535/catbookdb'; // config variable
var options = {
  useMongoClient: true
};
mongoose.connect(mongoURL, options);
mongoose.Promise = global.Promise;
var db = mongoose.connection;

// db error handling
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;
