const Sequelize = require("sequelize");
const models = require("./models");
const db = require("./index");
const uuidv4 = require("uuid/v4");
const SQL_Operators = Sequelize.Op;

const getSQLRawQuery = (appId, type) => {
  switch (type) {
    case "age":
      return `SELECT count(public.person.id) as count, (age/10)*10 as "ageRange"  from public.person INNER JOIN public.app_user ON public.person.id = public.app_user."userId" WHERE "appId" = ${appId} GROUP BY "ageRange" ORDER BY "ageRange"`;
    case "gender":
      return `SELECT count(public.person.id) as count, "gender" FROM public.person INNER JOIN public.app_user ON public.person.id = public.app_user."userId" WHERE "appId" = ${appId} GROUP BY "gender"`;
    case "country":
      return `SELECT count(public.person.id) as count, "country" FROM public.person INNER JOIN public.app_user ON public.person.id = public.app_user."userId" WHERE "appId" = ${appId} GROUP BY "country"`;
  }
};

const createSession = email => {
  const newToken = uuidv4();
  console.log(newToken);
  return models.Session.findOrCreate({
    where: {
      email
    },
    defaults: {
      email,
      token: newToken
    },
    returning: true
  }).then(
    session => {
      console.log(session[0]);
      return session[0];
    },
    err => {
      console.log(err);
      return Promise.reject(err);
    }
  );
};

const findSession = token => {
  return models.Session.findOne({
    where: { token: token }
  }).then(
    session => {
      if (session && session.token) {
        return session;
      } else {
        return Promise.reject("No Token available");
      }
    },
    err => {
      console.log(err);
      Promise.reject(err);
    }
  );
};

const deleteSession = token => {
  return models.Session.destroy({
    where: { token }
  });
};

const createUser = user => {
  console.log(user);
  return models.Person.create({
    ...user
  }).then(
    user => {
      console.log(user);
      return user;
    },
    err => {
      console.log(err);
      return Promise.reject(err);
    }
  );
};

const getUser = userId => {
  return models.Person.findOne({
    where: {
      id: userId
    }
  });
};
const getUserByEmail = email => {
  return models.Person.findOne({
    where: {
      email
    }
  });
};

const updateUser = (userId, body) => {
  return models.Person.update(
    {
      ...body
    },
    {
      where: {
        id: userId
      },
      limit: 1,
      returning: true
    }
  ).then(resp => resp[1][0]);
};

const createUserApps = (appArray, userId) => {
  try {
    return Promise.all(
      appArray.map(x =>
        models.PersonApp.findOrCreate({
          where: {
            appId: x.id,
            userId
          },
          defaults: {
            installed: true,
            appId: x.id,
            userId
          },
          returning: true
        })
      )
    ).then(values => values.map(x => x[0]));
  } catch (error) {
    console.log(error);
  }
};

const findUserApps = userId => {
  return models.PersonApp.findAll({
    where: {
      userId
    }
  });
};

const createApps = appNameArray => {
  try {
    return Promise.all(
      appNameArray.map(x =>
        models.App.findOrCreate({
          where: {
            name: x
          },
          defaults: {
            name: x,
            iconUrl: "N/A"
          },
          returning: true
        })
      )
    ).then(values => values.map(x => x[0]));
  } catch (error) {
    console.log(error);
  }
};
const getApps = appIdArray => {
  return models.App.findAll({
    where: {
      [SQL_Operators.or]: appIdArray.map(appId => ({ id: appId }))
    }
  }).then((apps, err) => {
    const appObj = {};
    apps.map(app => {
      appObj[app.id] = app;
    });
    return appObj;
  });
};

const appDemographics = appId => {
  models.PersonApp.findAll({
    where: {
      appId
    }
  });
};

const getTopApps = topNCount => {
  return db
    .query(
      `SELECT SUM("count")as "totalCount", SUM(CASE WHEN "gender" = \'M\' THEN "count" ELSE 0 END) AS "femaleCount", SUM(CASE WHEN "gender" = \'F\' THEN "count" ELSE 0 END) AS "maleCount", "appId" FROM (SELECT count("userId"), "appId", "gender" FROM public.app_user INNER JOIN public.person ON public.person.id="userId" GROUP BY "appId", "gender" ORDER BY "appId", "gender") AS temptable GROUP BY "appId" ORDER BY "totalCount" DESC LIMIT ${topNCount ||
        5}`,
      {
        type: db.QueryTypes.SELECT
      }
    )
    .then(counts => counts);
};
const getAppDemographics = (appId, type) => {
  return db.query(getSQLRawQuery(appId, type), {
    type: db.QueryTypes.SELECT
  });
};

const pushDummyData = () => {
  const personApps = [];
  for (let i = 1; i <= 20; i++) {
    const userId = i;
    for (let j = 1; j <= 10; j++) {
      let appId = Math.floor(Math.random() * 20);
      if (appId > 20) {
        appId = 20;
      }
      if (appId <= 0) {
        appId = 1;
      }
      personApps.push({
        appId,
        userId,
        installed: true
      });
    }
  }
  return models.PersonApp.bulkCreate(personApps).then(
    (resp, err) => personApps
  );
};

module.exports = {
  createSession,
  findSession,
  deleteSession,
  createUser,
  getUserByEmail,
  getUser,
  updateUser,
  createApps,
  getApps,
  createUserApps,
  findUserApps,
  pushDummyData,
  getTopApps,
  getAppDemographics
};
