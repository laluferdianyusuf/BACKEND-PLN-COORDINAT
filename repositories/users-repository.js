const { users } = require("../models");
class UserRepository {
  static async register({
    userId,
    name,
    username,
    email,
    address,
    password,
    role,
  }) {
    const registerUser = await users.create({
      userId: userId,
      name: name,
      username: username,
      email: email,
      address: address,
      password: password,
      role: role,
    });
    return registerUser;
  }

  static async findUserById({ userId }) {
    const findUser = await users.findOne({ where: { userId: userId } });
    return findUser;
  }

  static async findUserByEmail({ email }) {
    const findUser = await users.findOne({ where: { email } });
    return findUser;
  }

  static async getUserByUsername({ username }) {
    const getUser = await users.findOne({ where: { username } });
    return getUser;
  }
}

module.exports = UserRepository;
