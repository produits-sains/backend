//Import modules
const passport = require("passport");
const passportJWT = require("passport-jwt");
const jwt = require('jsonwebtoken');
const users = require('./db/users')

/*
//passport configuration
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function(err, user) {
    cb(err, user);
  });
*/
//Create strategy with JWT
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

//Create cookie token extractor
const cookieExtractor = function(req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};

//Configure JWT decoder
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromExtractors([ExtractJwt.fromUrlQueryParameter('token'), cookieExtractor])
jwtOptions.secretOrKey = process.env.JWT_SECRET;

//Run passport strategy on login request
const strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  users.query().findById(jwt_payload.userId)
        .then(user => {
          if(!user) {
            user = false;
          }
            next(null, user);
        });
});

//Configure express app with passport JWT strategy
module.exports = function(app) {
  passport.use(strategy);
  app.use(passport.initialize());
  app.use(passport.session());
  
  //register local passport variable for global access
  app.locals.passport = passport;
  
  app.locals.load_user_if_logged = function(req, res, next) {
    passport.authenticate('jwt', function(err, user, info) {
      if (err || !user) {
        req.user = null;
      } else {
        req.user = user;
      }
      next(); 
    })(req, res, next);
  };
  
  app.locals.need_logged = function(req, res, next) {
    app.locals.load_user_if_logged(req, res, () => {
      if(req.user == null) {
        res.redirect("/login");
      }
      else {
        next();
      }
    });
  };
  
  /*
  app.get("/seed", function(req, res){
    users.query().insert({
      email: 'test@test.fr'
    }).then(ulist => {
            res.json(ulist)
        });
  });
  */
  app.get("/users", function(req, res){
    users.query()
        .then(ulist => {
            res.json(ulist)
        });
  });
  
  
  app.get("/login", function(req, res){
    var payload = {userId: 1};
    var token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.cookie('token', token, { maxAge: 900000, httpOnly: true });
    res.redirect("/");
  });
}

