const express = require("express");
const dbService = require("./../../db/services");
const gService = require("./../../services/google");
const userRouter = express.Router();

userRouter.get("/profile/userId/:userId", function(req, res, next) {
  dbService
    .getUser(req.params.userId)
    .then(user => res.json({ user }), err => res.json(err));
});

userRouter.get("/profile/email/:email", function(req, res, next) {
  dbService
    .getUserByEmail(req.params.email)
    .then(({ password, ...user }) => res.json({ user }), err => res.json(err));
});

userRouter.post("/update/:userId", function(req, res, next) {
  if (req.authInfo.id === req.params.userId) {
    dbService.updateUser(req.params.userId, req.body).then(
      user => res.json({ user }),
      err => {
        res.statusCode = 400;
        res.json({ err });
      }
    );
  } else {
    res.statusCode = 400;
    res.json({
      invalid: true
    });
  }
});

module.exports = userRouter;
