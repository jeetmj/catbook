const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./models/user');

// set up passport configs
passport.use(new GoogleStrategy({
  clientID: '121876641182-2ek68mhau1s556fii5ve1g23ebinbrga.apps.googleusercontent.com', // config variables
  clientSecret: 'BZEcbkgZLq-JlTodXLIZcdBL',
  callbackURL: '/auth/google/callback'
}, function(accessToken, refreshToken, profile, done) {
  User.findOne({
    'googleid': profile.id
  }, function(err, user) {
    if (err) return done(err);

    if (!user) {
      const user = new User({
        name: profile.displayName,
        googleid: profile.id
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
