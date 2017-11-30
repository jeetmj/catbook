// import node modules
var mongoose = require('mongoose');

// define a schema
var CommentModelSchema = new mongoose.Schema ({
  owner       : String,
  parent      : String,
  message     : String,
});

// compile model from schema
module.exports = mongoose.model('CommentModel', CommentModelSchema);
