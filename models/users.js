"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      users.hasMany(models.histories, {
        foreignKey: "user_id",
      });
    }
  }
  users.init(
    {
      userId: DataTypes.STRING,
      name: DataTypes.STRING,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      url: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
