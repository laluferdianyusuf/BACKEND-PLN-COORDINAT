const UserRepository = require("../repositories/users-repository");
const bcrypt = require("bcrypt");
const { JWT, ROLES } = require("../lib/constant");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../models");

class UserService {
  static validateFields(fields) {
    for (const [key, value] of Object.entries(fields)) {
      if (!value) {
        return `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
    }
    return null;
  }

  static async register({ name, username, email, address, password }) {
    const transaction = await sequelize.transaction();
    try {
      const error = this.validateFields({
        name: name,
        username: username,
        email: email,
        address: address,
        password: password,
      });
      if (error) {
        return {
          status: false,
          status_code: 400,
          message: error,
          data: { user: null },
        };
      }
      if (password.length < 8) {
        return {
          status: false,
          status_code: 400,
          message: "Password must be at least 8 characters",
          data: { user: null },
        };
      }

      const [existingEmail, existingUsername] = await Promise.all([
        UserRepository.findUserByEmail({ email }),
        UserRepository.getUserByUsername({ username }),
      ]);

      if (existingEmail) {
        return {
          status: false,
          status_code: 400,
          message: "Email address is already registered",
          data: { user: null },
        };
      }

      if (existingUsername) {
        return {
          status: false,
          status_code: 400,
          message: "Username is already taken",
          data: { user: null },
        };
      }

      const hashedPassword = await bcrypt.hash(password, JWT.SALT_ROUND);
      const registeredUser = await UserRepository.register(
        {
          userId: uuidv4(),
          name: name,
          username: username,
          email: email,
          address: address,
          password: hashedPassword,
          role: ROLES.USER,
        },
        transaction
      );

      await transaction.commit();

      return {
        status: true,
        status_code: 201,
        message: "User successfully registered",
        data: { user: registeredUser },
      };
    } catch (error) {
      await transaction.rollback();
      return {
        status: false,
        status_code: 500,
        message: error.message,
        data: { user: null },
      };
    }
  }

  static async login({ username, password, role }) {
    try {
      const error = this.validateFields({
        username: username,
        password: password,
        role: role,
      });
      if (error) {
        return {
          status: false,
          status_code: 400,
          message: error,
          data: { user: null, token: null },
        };
      }

      const user = await UserRepository.getUserByUsername({
        username: username,
      });

      if (!user) {
        return {
          status: false,
          status_code: 403,
          message: "Invalid Username, try again",
          data: { user: null, token: null },
        };
      }

      if (user.role !== role) {
        return {
          status: false,
          status_code: 403,
          message: `Logged in as '${user.role}', expected '${role}'`,
          data: { user: null, token: null },
        };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return {
          status: false,
          status_code: 403,
          message: "Invalid password, try again",
          data: { user: null, token: null },
        };
      }

      const token = await jwt.sign(
        {
          userId: user.userId,
          name: user.name,
          username: user.username,
          email: user.email,
        },
        JWT.SECRET,
        { expiresIn: JWT.EXPIRED }
      );

      return {
        status: true,
        status_code: 200,
        message: "Successfully signed",
        data: { user: user, token: token },
      };
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: error.message,
        data: { user: null, token: null },
      };
    }
  }

  static async changePassword({
    userId,
    currentPassword,
    password,
    reTypePassword,
  }) {
    const transaction = await sequelize.transaction();
    try {
      const error = this.validateFields({
        userId,
        currentPassword,
        password,
        reTypePassword,
      });
      if (error) {
        return {
          status: false,
          status_code: 400,
          message: error,
          data: { user: null, token: null },
        };
      }

      if (password.length < 8) {
        return {
          status: false,
          status_code: 400,
          message: "New password must be at least 8 characters",
          data: { user: null, token: null },
        };
      }

      if (password !== reTypePassword) {
        return {
          status: false,
          status_code: 400,
          message: "New password and confirmation do not match",
          data: { user: null, token: null },
        };
      }

      const user = await UserRepository.findUserById({ userId: userId });
      if (!user) {
        return {
          status: false,
          status_code: 404,
          message: `User not found`,
          data: { user: null, token: null },
        };
      }

      const isOldPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isOldPasswordValid) {
        return {
          status: false,
          status_code: 403,
          message: "Current password is incorrect",
          data: { user: null, token: null },
        };
      }

      const hashedPassword = await bcrypt.hash(password, JWT.SALT_ROUND);
      const updatedUser = await UserRepository.changePassword(
        {
          userId: userId,
          password: hashedPassword,
        },
        transaction
      );

      await transaction.commit();

      const token = await jwt.sign(
        {
          userId: updatedUser.userId,
          name: updatedUser.name,
          username: updatedUser.username,
          email: updatedUser.email,
        },
        JWT.SECRET,
        { expiresIn: JWT.EXPIRED }
      );

      return {
        status: true,
        status_code: 200,
        message: "Password changed successfully",
        data: { user: updatedUser, token: token },
      };
    } catch (error) {
      await transaction.rollback();
      return {
        status: false,
        status_code: 500,
        message: "Server Error" + error,
        data: { user: null, token: null },
      };
    }
  }

  static async updateUrl({ id, url }) {
    const transaction = await sequelize.transaction();
    try {
      const error = this.validateFields({
        id,
        url,
      });

      if (error) {
        return {
          status: false,
          status_code: 400,
          message: error,
          data: { user: null },
        };
      }

      const user = await UserRepository.findUserById({ userId: id });
      if (!user) {
        return {
          status: false,
          status_code: 404,
          message: `User not found`,
          data: { user: null },
        };
      }

      const updateUrl = await UserRepository.updateUrl(
        {
          userId: id,
          url: url,
        },
        transaction
      );

      await transaction.commit();

      return {
        status: true,
        status_code: 200,
        message: "Password changed successfully",
        data: { user: updateUrl },
      };
    } catch (error) {
      await transaction.rollback();
      return {
        status: false,
        status_code: 500,
        message: "Server Error" + error,
        data: { user: null },
      };
    }
  }

  static async getAllUsers() {
    try {
      const users = await UserRepository.getAllUsers();

      return {
        status: true,
        status_code: 200,
        message: "Users retrieved",
        data: users,
      };
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "Server Error" + error,
        data: { user: [] },
      };
    }
  }
}

module.exports = UserService;
