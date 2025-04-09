const UserRepository = require("../repositories/users-repository");
const bcrypt = require("bcrypt");
const { JWT, ROLES } = require("../lib/constant");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

class UserService {
  static async register({ name, username, email, address, password }) {
    try {
      if (!name) {
        return {
          status: false,
          status_code: 400,
          message: "Name is required",
          data: { user: null },
        };
      }
      if (!username) {
        return {
          status: false,
          status_code: 400,
          message: "Username is required",
          data: { user: null },
        };
      }
      if (!email) {
        return {
          status: false,
          status_code: 400,
          message: "Email is required",
          data: { user: null },
        };
      }
      if (!address) {
        return {
          status: false,
          status_code: 400,
          message: "Address is required",
          data: { user: null },
        };
      }
      if (!password) {
        return {
          status: false,
          status_code: 400,
          message: "Password is required",
          data: { user: null },
        };
      } else if (password.length < 8) {
        return {
          status: false,
          status_code: 400,
          message: "Password must be at least 8 characters",
          data: { user: null },
        };
      }

      const findEmail = await UserRepository.findUserByEmail({ email: email });
      if (findEmail) {
        return {
          status: false,
          status_code: 400,
          message: "Email address has already been registered",
          data: { user: null },
        };
      } else {
        const hashedPassword = await bcrypt.hash(password, JWT.SALT_ROUND);
        const registeredUser = await UserRepository.register({
          userId: uuidv4(),
          name: name,
          username: username,
          email: email,
          address: address,
          password: hashedPassword,
          role: ROLES.USER,
        });
        return {
          status: true,
          status_code: 201,
          message: "User successfully registered",
          data: { user: registeredUser },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: error.message,
        data: { user: null },
      };
    }
  }

  static async login({ username, password }) {
    try {
      if (!username) {
        return {
          status: false,
          status_code: 400,
          message: "Username are required",
          data: { user: null, token: null },
        };
      }
      if (!password) {
        return {
          status: false,
          status_code: 400,
          message: "Password are required",
          data: { user: null, token: null },
        };
      }

      const getUser = await UserRepository.getUserByUsername({
        username: username,
      });

      if (!getUser) {
        return {
          status: false,
          status_code: 403,
          message: "Invalid Username, try again",
          data: { user: null, token: null },
        };
      }

      const isPasswordValid = await bcrypt.compare(password, getUser.password);
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
          userId: getUser.userId,
          name: getUser.name,
          username: getUser.username,
          email: getUser.email,
        },
        JWT.SECRET
      );

      return {
        status: true,
        status_code: 200,
        message: "Successfully signed",
        data: { user: getUser, token: token },
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
}

module.exports = UserService;
