"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class histories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      histories.belongsTo(models.users, {
        foreignKey: "user_id",
      });
    }
  }
  histories.init(
    {
      user_id: { type: DataTypes.STRING, allowNull: false },
      category: {
        type: DataTypes.ENUM(
          "maps",
          "mcb_1_phase",
          "mcb_3_phase",
          "fuse_link",
          "fuse_link_branch",
          "nh_fuse_substation",
          "balancer"
        ),
        allowNull: false,
      },
      title: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      value: { type: DataTypes.JSON, allowNull: false },
      background: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "histories",
    }
  );
  return histories;
};
