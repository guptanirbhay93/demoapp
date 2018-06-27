const express = require("express");
const gService = require("./services/google");
const dbService = require("./db/services");
const Auth_Router = express.Router();

Auth_Router.post("/verify-token", function(req, res, next) {
  gService
    .verify(req.body.token)
    .then(resp => {
      dbService.createSession(resp.email).then(session => {
        res.set("Authorization", `Bearer ${session.token}`);
        res.json(resp);
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500);
      res.json({
        valid: false
      });
    });
});

Auth_Router.get("/logout", function(req, res, next) {
  const token = req.header("authorization").split(" ")[1];
  dbService.deleteSession(token).then(
    resp => {
      res.json({
        signout: true
      });
    },
    err => {
      res.json({
        signout: false
      });
    }
  );
});

module.exports = Auth_Router;
