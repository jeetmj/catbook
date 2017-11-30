// import node modules
var mongoose = require('mongoose');

// define a schema
var StoryModelSchema = new mongoose.Schema ({
  owner       : String,
  message     : String,
  comment_ids : String,
});

// compile model from schema
module.exports = mongoose.model('StoryModel', StoryModelSchema);
