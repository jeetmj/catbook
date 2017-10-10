// import node modules
var mongoose = require('mongoose');

// define a schema
var UserModelSchema = new mongoose.Schema ({
  _id         : Schema.Types.ObjectId,
  username    : String,
});

// compile model from schema
module.exports = mongoose.model('UserModel', UserModelSchema);
