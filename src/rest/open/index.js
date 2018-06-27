const express = require("express");
const dbService = require("./../../db/services");
const restRouter = express.Router();

restRouter.get("/topN/:count?", function(req, res, next) {
  // Set the base top count no;
  const topNCount = req.params.count || 10;

  dbService.getTopApps(topNCount).then(resp => {
    const appIdArray = resp.map(x => x.appId);

    dbService.getApps(appIdArray).then(apps =>
      res.json({
        topN: resp,
        apps,
        topNCount
      })
    );
  });
});

restRouter.get("/get-auth-token/:email", function(req, res, next) {
  dbService
    .createSession(req.params.email)
    .then(resp =>
      res.json({
        token: resp.token
      })
    )
    .catch(err => res.json({ err }));
});

module.exports = restRouter;
