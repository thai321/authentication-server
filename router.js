const Authentication = require('./controllers/authentication');

const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });

const requireSignin = passport.authenticate('local', { session: false }); // middleware


module.exports = function(app)  {
  // any request must pass through this requireAuth
  // and then callback function
  app.get('/', requireAuth, function(req, res){
    res.send({ hi: 'there' });
  });

  // require a sign in middleware before
  // get access
  app.post('/signin', requireSignin, Authentication.signin);

  app.post('/signup', Authentication.signup);
}
