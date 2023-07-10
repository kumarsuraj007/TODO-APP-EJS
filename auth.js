const passport = require('passport');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const dotenv = require('dotenv');
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_id;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_secret;

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
  }
));

passport.serializeUser(function (user, done) {
    done(null, user)
});

passport.deserializeUser(function (user, done) {
    done(null, user)
});