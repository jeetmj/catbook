// import node modules
const mongoose = require('mongoose');

// define a schema
const UserModelSchema = new mongoose.Schema ({
  name        : String,
  fbid        : String,
  friends     : [ mongoose.Schema.Types.ObjectId ],
});

// compile model from schema
module.exports = mongoose.model('UserModel', UserModelSchema);
