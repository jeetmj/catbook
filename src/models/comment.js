// import node modules
const mongoose = require('mongoose');

// define a schema
const CommentModelSchema = new mongoose.Schema ({
  owner       : String,
  parent      : String,
  message     : String,
});

// compile model from schema
module.exports = mongoose.model('CommentModel', CommentModelSchema);
