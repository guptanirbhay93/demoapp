const express = require("express");
const gService = require("./services/google");

const Auth_Router = express.Router();

Auth_Router.post("/verify-token", function(req, res, next) {
  gService
    .verify(req.body.token)
    .then(resp => {
      console.log(resp);
      res.json(resp);
    })
    .catch(err => {
      console.log(err);
      res.json({
        valid: false
      });
    });
});

module.exports = Auth_Router;
