const passport = require("passport");
const Strategy = require("passport-http-bearer").Strategy;

const dbService = require("../db/services");

passport.use(
  new Strategy((token, cb) => {
    dbService
      .findSession(token)
      .then(
        session =>
          dbService
            .getUserByEmail(session.email)
            .then(
              user =>
                cb(
                  null,
                  { token, ...user },
                  { token, id: user.id, email: user.email }
                ),
              err => cb(null, false)
            ),
        err => cb(err, null)
      );
  })
);

module.exports = passport.authenticate("bearer", { session: false });
