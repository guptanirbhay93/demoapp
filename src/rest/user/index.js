const express = require("express");
const dbService = require("./../../db/services");
const userRouter = express.Router();

userRouter.get("/profile/:userId", function(req, res, next) {
  dbService
    .getUser(Number(req.params.userId))
    .then((user, err) => res.json({ user }));
});

userRouter.post("/create", function(req, res, next) {
  res.json({
    creating: "wait"
  });
});

userRouter.post("/update/:userId", function(req, res, next) {
  dbService
    .updateUser(Number(req.params.userId), req.body)
    .then((user, err) => res.json({ user }));
});

module.exports = userRouter;
