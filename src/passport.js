const passport = require('passport');
const fbp = require('passport-facebook');

const User = require('./models/user');

// set up passport configs
passport.use(new fbp.Strategy({
  clientID: "1783717201933159", // config variables
  clientSecret: "9ed4fe148172cd10d034bf8008d2fe23",
  callbackURL: "http://localhost:3000/auth/facebook/callback"
}, function(accessToken, refreshToken, profile, done) {
  User.findOne({
    'fbid': profile._id
  }, function(err, user) {
    if (err) return done(err);

    if (!user) {
      const user = new User({
        name: profile.displayName,
        fbid: profile._id
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

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = passport;
