const UserService = require("../services/users-service");

const register = async (req, res) => {
  const { name, username, email, address, password } = req.body;

  const { status, status_code, message, data } = await UserService.register({
    name: name,
    username: username,
    email: email,
    address: address,
    password: password,
  });

  res.status(status_code).send({
    status: status,
    message: message,
    data: data,
  });
};

const login = async (req, res, next) => {
  const { username, password, role } = req.body;

  const { status, status_code, message, data } = await UserService.login({
    username: username,
    password: password,
    role: role,
  });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const currentUser = async (req, res) => {
  const currentUser = req.users;

  res.status(200).send({
    status: true,
    message: "You are logged in with this user",
    data: { user: currentUser },
  });
};

const changePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, password, reTypePassword } = req.body;

  const { status, status_code, message, data } =
    await UserService.changePassword({
      userId: id,
      currentPassword: currentPassword,
      password: password,
      reTypePassword: reTypePassword,
    });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const updateUrl = async (req, res) => {
  const { id } = req.params;
  const { url } = req.body;

  const { status, status_code, message, data } = await UserService.updateUrl({
    id: id,
    url: url,
  });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const getAllUsers = async (req, res) => {
  const { status, status_code, message, data } =
    await UserService.getAllUsers();

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

module.exports = {
  register,
  login,
  currentUser,
  changePassword,
  updateUrl,
  getAllUsers,
};
