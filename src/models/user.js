// import node modules
var mongoose = require('mongoose');

// define a schema
var UserModelSchema = new mongoose.Schema ({
  name        : String,
  fbid        : String,
  friends     : [ mongoose.Schema.Types.ObjectId ],
});

// compile model from schema
module.exports = mongoose.model('UserModel', UserModelSchema);
