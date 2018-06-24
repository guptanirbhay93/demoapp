const express = require("express");
const dbService = require("./../../db/services");
const restRouter = express.Router();

restRouter.get("/app-list/:userId", function(req, res, next) {
  dbService.findUserApps(Number(req.params.userId)).then((resp, err) => {
    const appIds = resp.map(appUser => appUser.appId);
    dbService.getApps(appIds).then((appObj, err) => {
      res.json({
        appUser: resp,
        appObj
      });
    });
  });
});

restRouter.get("/populate", function(req, res, next) {
  dbService
    .pushDummyData()
    .then(resp => res.json({ resp, count: resp.length }));
});

module.exports = restRouter;
