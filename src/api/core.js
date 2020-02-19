module.exports = function(app) {
  //Ping API should return the version of the API and if the user is authenticated or not
  app.get("/api/core/ping", function(req, res, next){    
    app.locals.passport.authenticate('jwt', function(err, user, info) {
      if (err) { 
        return next(err); 
      }
      else {
        const output = {};
        output.ping = true;
        output.version = "1.0.0";      
        if(!user) {
          output.auth = false;
        }
        else {
          output.auth = true;
        }
        return res.json(output);
    }
    })(req, res, next);
  });

  
  app.get("/api/core/test", app.locals.passport.authenticate('jwt', { session: false }), function(req, res){
    res.json({message: "Success! You can not see this without a token"});
  });
  
  
};