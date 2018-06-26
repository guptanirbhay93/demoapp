const express = require("express");
const createError = require("http-errors");
const path = require("path");
const logger = require("morgan");
const Auth_Router = require("./auth");
const OpenAPI_Router = require("./rest/open/index");
const AuthorizedAPI_Router = require("./rest/authorized/index");
const User_Router = require("./rest/user/index");
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/auth", Auth_Router);
app.use("/user", User_Router);
app.use("/api/open", OpenAPI_Router);
app.use("/api/authorized", AuthorizedAPI_Router);

app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
