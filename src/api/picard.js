
module.exports = function(app) {
  //Ping API should return the version of the API and if the user is authenticated or not 
  app.get("/api/picard/parse/:id", app.locals.passport.authenticate('jwt', { session: false }), function(req, res){
    //init output object for formated answer
    const output = {};
    output.id = req.params.id;
    output.failure = false;

    //Try to get all the data
    app.locals.picard.parseProductAndExtractDataById(output.id, (product_info, error) => {
      //write product information to the output
      output.productInfo = product_info;
      
      //log errors if any
      if(error) {
        output.error = error;
        output.failure = true;
      }
      
      //send formated output object
      res.json(output);
    });
  });
};