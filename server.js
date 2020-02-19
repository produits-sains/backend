// server.js
// where your node app starts

// init project
const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const bodyParser = require('body-parser');
const auth = require("./src/auth.js");
const core_api = require("./src/api/core.js");
const picard_api = require("./src/api/picard.js");
const admin = require("./src/admin/routes.js");
const site = require("./src/site.js");


// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

app.set('view engine', 'pug');
app.use(express.static("public"));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser());

auth(app);
core_api(app);
picard_api(app);
admin(app);
site(app);

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
