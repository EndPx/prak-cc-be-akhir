const db = require("../config/Database.js");
const { Sequelize } = require("sequelize");
const User = require("./UserModel.js");
const Category = require("./CategoryModel.js")

const Transaction = db.define("transaction", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  categoryId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  amount: {
    type: Sequelize.DECIMAL(12, 2),
    allowNull: false,
  },
  note: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
});

// Relasi
User.hasMany(Transaction, { foreignKey: "userId" });
Transaction.belongsTo(User, { foreignKey: "userId" });

Category.hasMany(Transaction, { foreignKey: "categoryId" });
Transaction.belongsTo(Category, { foreignKey: "categoryId" });

module.exports = Transaction;
