const passport = require('passport');
const User = require('../models/user');
const config = require('../config');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const LocalStrategy = require('passport-local');

// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  // Verify this username and password
  // if it is the correct username and password
  // otherwise, call done with false
  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    // compare password - is 'password' equal  to user.password?
    user.comparePassword(password, function(err, isMatch){
      if (err) { return done(err); } // err in server response
      if (!isMatch) { return done(null, false); } // no match, can't find user

      return done(null, user); // match
    });
  });

});



// Setup options for JWT Strategy
const jwtOptions = {
  // get token from authorization header
  // header is authorization with value of token
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret // for decode
};

// Create JWT Strategy // payload here is user.id and timestamp in
// authentication.js
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user ID in th epayload exists in our database
  // If it does, call 'done' with that other
  // otherwise, call done without a user object

  // payload here is the token which contains sub: user.id, and iat
  User.findById(payload.sub, function(err, user){
    if(err) { return done(err, false); } // false, we didn't find a user
    // err occurers

    if(user) {  // if we found a user
      done(null, user); // call without an error and a user
    } else {
      done(null, false); // call without an error, but can't find a user
    }
  });

});


// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
