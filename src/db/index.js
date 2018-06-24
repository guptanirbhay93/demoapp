const Sequelize = require("sequelize");

const db = new Sequelize("demodb", "demopostgres", "demopostgres123", {
  host: "localhost",
  dialect: "postgres",
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

db.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = db;
