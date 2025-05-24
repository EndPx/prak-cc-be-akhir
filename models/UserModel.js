const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/Database.js");

const User = db.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  paranoid: true, 
  timestamps: true,
  deletedAt: "deletedAt",
});

db.sync().then(() => console.log("Database synced"));

module.exports = User;
