const mongoose = require('mongoose');

// set up mongoDB connection
const mongoURL = 'mongodb://admin:password@ds237707.mlab.com:37707/catbookdb'; // config variable
const options = {
  useMongoClient: true
};
mongoose.connect(mongoURL, options);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

// db error handling
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;
