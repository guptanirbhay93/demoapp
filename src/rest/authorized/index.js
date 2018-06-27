const express = require("express");
const dbService = require("./../../db/services");
const restRouter = express.Router();

restRouter.post("/app-list/:userId", function(req, res, next) {
  try {
    dbService
      .createApps(req.body.apps)
      .then(apps => {
        console.log(apps);
        return dbService
          .createUserApps(apps, req.params.userId)
          .then(resp => ({ apps: resp, appObj: apps }));
      })
      .then(
        resp => {
          res.json({
            success: true,
            ...resp
          });
        },
        err => {
          res.statusCode = 400;
          res.json({
            success: false
          });
        }
      );
  } catch (error) {
    console.log(error);
    res.statusCode = 400;
    res.json(error);
  }
});

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

restRouter.get("/app-demographics/:appId/:type", function(req, res, next) {
  dbService
    .getAppDemographics(req.params.appId, req.params.type)
    .then(resp => res.json({ resp }));
});

restRouter.get("/populate", function(req, res, next) {
  dbService
    .pushDummyData()
    .then(resp => res.json({ resp, count: resp.length }));
});

module.exports = restRouter;
