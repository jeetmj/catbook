const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const request = require('request');

// load user model
const User = require('./models/user');
// load your client credentials, which are provided by MIT OpenID
// make sure to replace these with the right clients!!
const oauth_credentials = {
  client: {
    id: process.env.MIT_OPENID_ID,
    secret: process.env.MIT_OPENID_SECRET
  }
};

// create the passport OAuth2.0 parameters
// these parameters are simply required by OAuth2.0
const host = 'http://localhost:3000';
const passport_parameter = {
  authorizationURL: 'https://oidc.mit.edu/authorize',
  tokenURL: 'https://oidc.mit.edu/token',
  clientID: oauth_credentials.client.id,
  clientSecret: oauth_credentials.client.secret,
  callbackURL: host + '/auth/oidc/callback'
};


// set up passport configs
passport.use('oidc', new OAuth2Strategy(passport_parameter, function (accessToken, refreshToken, profile, done) {

  // the callback of this function is to simply run getUserInformation(),
  // which is defined below
  getUserInformation();

  function getUserInformation() {
    request(buildUserInfoRequestParameter(accessToken), function (error, response, body) {
      if (!error && response.statusCode === 200) {
        // uncomment the next line to see what your user object looks like
        // console.log(JSON.parse(body))
        return findOrCreateUser(JSON.parse(body));
      } else {
        return done(new Error('An error occurred while making the access request'));
      }
    });
  }

  // this function basically works with 'request' to make a get request
  // with the header 'Authorization': 'Bearer <accessToken>', which is
  // where we put the key (accessToken) in order to exchange it for the
  // application user's informations
  function buildUserInfoRequestParameter(accessToken) {
    return {
      url: 'https://oidc.mit.edu/userinfo',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    };
  }

  function findOrCreateUser(userInformation) {
    User.findOne({openid: userInformation.sub}, function (err, user) {
      if (err) {
        return done(err);
      } else if (!user) {
        return createUser(userInformation);
      }
      return done(null, user);
    });
  }

  // simply create the user using the mongoose model User
  function createUser(userInformation) {
    const new_user = new User({
      name: userInformation.name,
      openid: userInformation.sub
    });
    new_user.save(function (err, user) {
      if (err) {
        return done(err);
      }
      return done(null, user);
    });
  }
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = passport;
