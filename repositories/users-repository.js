const { Op } = require("sequelize");
const { users } = require("../models");

class UserRepository {
  static async register(
    { userId, name, username, email, address, password, role },
    transaction
  ) {
    return await users.create(
      {
        userId,
        name,
        username,
        email,
        address,
        password,
        role,
      },
      { transaction }
    );
  }

  static async findUserById({ userId }) {
    return await users.findOne({ where: { userId } });
  }
  static async findUserNameById({ userId }) {
    return await users.findOne({ where: { userId }, attributes: ["name"] });
  }
  static async findUserByEmail({ email }) {
    return await users.findOne({ where: { email } });
  }

  static async getUserByUsername({ username }) {
    return await users.findOne({ where: { username } });
  }

  static async changePassword({ userId, password }, transaction) {
    await users.update({ password }, { where: { userId }, transaction });
    return await users.findOne({
      where: { userId },
      attributes: { exclude: ["password"] },
    });
  }

  static async updateUrl({ userId, url }, transaction) {
    await users.update({ url }, { where: { userId }, transaction });
    return await users.findOne({
      where: { userId },
      attributes: { exclude: ["password"] },
    });
  }

  static async getAllUsers() {
    return await users.findAll({
      attributes: ["id", "userId", "role", "name", "url"],
      // where: {
      //   role: {
      //     [Op.ne]: "guest",
      //   },
      // },
    });
  }
}

module.exports = UserRepository;
