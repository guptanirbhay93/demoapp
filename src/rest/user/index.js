const express = require("express");
const dbService = require("./../../db/services");
const gService = require("./../../services/google");
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

userRouter.post("/signup", function(req, res, next) {
  try {
    dbService
      .getUserByEmail(req.body.email)
      .then(user => {
        console.log(user, "USER");
        if (user) {
          return user;
        } else {
          return dbService.createUser({
            ...req.body,
            age: 0,
            gender: "N/A",
            country: "N/A"
          });
        }
      })
      .then(user => res.json({ user }))
      .catch(err => {
        res.status(500);
        res.json({ err });
      });
  } catch (error) {
    res.status(500);
    res.json({ user: null });
  }
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
