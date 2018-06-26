const express = require("express");
const dbService = require("./../../db/services");
const userRouter = express.Router();

userRouter.get("/profile/userId/:userId", function(req, res, next) {
  dbService
    .getUser(Number(req.params.userId))
    .then(user => res.json({ user }), err => res.json(err));
});

userRouter.get("/profile/email/:email", function(req, res, next) {
  dbService
    .getUserByEmail(req.params.email)
    .then(user => res.json({ user }), err => res.json(err));
});

userRouter.post("/create", function(req, res, next) {
  dbService.createUser(req.body).then((user, err) => res.json({ user }));
});

userRouter.post("/update/:userId", function(req, res, next) {
  dbService
    .updateUser(Number(req.params.userId), req.body)
    .then((user, err) => res.json({ user }));
});

module.exports = userRouter;
