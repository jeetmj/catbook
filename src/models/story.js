// import node modules
const mongoose = require('mongoose');

// define a schema
const StoryModelSchema = new mongoose.Schema ({
  owner       : String,
  message     : String,
  comment_ids : String,
});

// compile model from schema
module.exports = mongoose.model('StoryModel', StoryModelSchema);
