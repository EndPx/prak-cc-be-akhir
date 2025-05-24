const { Sequelize } = require("sequelize");
const db = require("../config/Database.js");
const User = require("./UserModel.js");

const Category = db.define("category", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type: {
    type: Sequelize.ENUM("income", "expense"),
    allowNull: false,
  },
}, {
  paranoid: true,
  deletedAt: "deletedAt",
  timestamps: true  
});

// Relasi ke User
User.hasMany(Category, { foreignKey: "userId" });
Category.belongsTo(User, { foreignKey: "userId" });

module.exports = Category;
