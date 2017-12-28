const mongoose = require('mongoose');

// set up mongoDB connection
const mongoURL = 'mongodb://admin:password@ds121535.mlab.com:21535/catbookdb'; // config variable
const options = {
  useMongoClient: true
};
mongoose.connect(mongoURL, options);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

// db error handling
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;
