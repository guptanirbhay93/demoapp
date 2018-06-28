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
Auth_Router.post("/user-sign-up", function(req, res, next) {
  dbService.getUserByEmail(req.body.email).then(user => {
    if (!user || user.email !== req.body.email) {
      dbService
        .createUser({
          ...req.body,
          age: 0,
          gender: "N/A",
          country: "N/A",
          imageUri: "N/A"
        })
        .then(newUser => {
          dbService.createSession(req.body.email).then(session => {
            res.setHeader("Authorization", `Bearer ${session.token}`);
            res.json({
              userId: newUser.id,
              success: true
            });
          });
        })
        .catch(err => {
          res.statusCode = 400;
          res.json({
            success: false,
            err
          });
        });
    } else {
      res.statusCode = 400;
      res.json({
        success: false
      });
    }
  });
});
Auth_Router.post("/login", function(req, res, next) {
  dbService.getUserByEmail(req.body.email).then(user => {
    if (user && user.password === req.body.password) {
      return dbService.createSession(user.email).then(session => {
        res.setHeader("Authorization", `Bearer ${session.token}`);
        res.json({
          success: true,
          userId: user.id
        });
      });
    } else {
      res.statusCode = 400;
      res.json({
        success: false
      });
    }
  });
});

Auth_Router.get("/logout", function(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error("no token");
    }
    dbService.deleteSession(token).then(
      resp => {
        res.json({
          success: true
        });
      },
      err => {
        res.json({
          success: false
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

module.exports = Auth_Router;
