module.exports = function(app) {
  //Default page for the website
  app.get("/", app.locals.load_user_if_logged, function(req, res){
    res.render('index', {user: req.user});
  });
};