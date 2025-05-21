const jwt = require("jsonwebtoken");
const { JWT, ROLES } = require("../lib/constant");
const UserRepository = require("../repositories/users-repository");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized: Token not provided",
        data: null,
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT.SECRET);
    const user = await UserRepository.findUserByEmail({ email: decoded.email });

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized: User not found",
        data: null,
      });
    }

    req.users = user;
    next();
  } catch (err) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized: Invalid or expired token",
      data: null,
    });
  }
};

const isSupervisor = (req, res, next) => {
  const user = req.users;

  if ([ROLES.SUPERVISOR, ROLES.ADMIN].includes(user?.role)) {
    return next();
  }

  return res.status(403).json({
    status: false,
    message: "Forbidden: You don't have supervisor privileges",
    data: null,
  });
};

module.exports = { authenticate, isSupervisor };
