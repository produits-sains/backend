const users = require("../db/users");
const logs = require("../db/logs");
const ingredients = require("../db/ingredients");
const { preparePage } = require("./utils");
const picard = require("./picard");

module.exports = function(app) {
  //Landing page for admin
  app.get("/admin", app.locals.need_logged, function(req, res) {
    preparePage(req, res, "Tableau de bord").render();
  });

  app.get("/admin/users", app.locals.need_logged, function(req, res) {
    users.query().then(ulist => {
      preparePage(req, res, "Tableau de bord")
        .renderTable("Liste des utilisateurs", ["id", "email"], ulist)
        .render();
    });
  });
  
  app.get("/admin/ingredients", app.locals.need_logged, function(req, res) {
    ingredients.query().then(ilist => {
      preparePage(req, res, "Ingredients")
        .renderTable("Liste", ["id", "name", "type", "score", "additiveId"], ilist)
        .render();
    });
  });

  app.get("/admin/logs", app.locals.need_logged, function(req, res) {
    logs
      .query()
      .orderBy("id", "desc")
      .then(llist => {
        preparePage(req, res, "Logs")
          .renderTable(
            "Derniers logs",
            ["id", "created_at", "severity", "module", "title", "info"],
            llist
          )
          .render();
      });
  });

  //add picard specific routes
  picard(app);
};
