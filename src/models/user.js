// import node modules
const mongoose = require('mongoose');

// define a schema
const UserModelSchema = new mongoose.Schema ({
  name: String,
  fbid: String,
  googleid: String,
  openid: String,
  last_post: String,
  favorite_fact: String,
});

// compile model from schema
module.exports = mongoose.model('UserModel', UserModelSchema);
