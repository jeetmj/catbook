const passport = require('passport');
// load user model
const User = require('./models/user');
/* First, we make the facebook Authentication */
const fbp = require('passport-facebook');
// set up passport configs
passport.use(new fbp.Strategy({
  clientID: process.env.FB_CLIENT_ID, // config variables
  clientSecret: process.env.FB_CLIENT_SECRET,
  callbackURL: '/auth/facebook/callback'
}, function(accessToken, refreshToken, profile, done) {
  User.findOne({
    'fbid': profile.id
  }, function(err, user) {
    if (err) return done(err);

    if (!user) {
      const user = new User({
        name: profile.displayName,
        fbid: profile.id
      });

      user.save(function(err) {
        if (err) console.log(err);

        return done(err, user);
      });
    } else {
      return done(err, user);
    }
  });
}));

/* Next, we make the MIT OpenID Connect Authentication */
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const request = require('request');

// load your MIT OpenID client credentials
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

  getUserInformation();

  function getUserInformation() {
    request(buildUserInfoRequestParameter(accessToken), function (error, response, body) {
      if (!error && response.statusCode === 200) {
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

/* Finally, write / execute those two necessary passport methods */
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = passport;
