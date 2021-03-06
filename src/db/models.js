const Sequelize = require("sequelize");
const db = require("./index");

const BASE_MODEL_OPTIONS = {
  freezeTableName: true,
  schema: "public",
  createdAt: false,
  updatedAt: false
};

const Session = db.define(
  "session",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      allowNull: true
    },
    token: Sequelize.TEXT,
    email: Sequelize.TEXT
  },
  { ...BASE_MODEL_OPTIONS }
);

const Person = db.define(
  "person",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      allowNull: true
    },
    name: Sequelize.CHAR(80),
    email: Sequelize.CHAR(80),
    password: Sequelize.TEXT,
    age: Sequelize.INTEGER,
    gender: Sequelize.TEXT,
    country: Sequelize.TEXT,
    imageUri: Sequelize.TEXT
  },
  { ...BASE_MODEL_OPTIONS }
);

const App = db.define(
  "android_app",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      allowNull: true
    },
    name: Sequelize.TEXT,
    iconUrl: Sequelize.TEXT
  },
  { ...BASE_MODEL_OPTIONS }
);

const PersonApp = db.define(
  "app_user",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      allowNull: true
    },
    userId: Sequelize.BIGINT,
    appId: Sequelize.BIGINT,
    installed: Sequelize.BOOLEAN
  },
  { ...BASE_MODEL_OPTIONS }
);

module.exports = {
  Person,
  App,
  PersonApp,
  Session
};
