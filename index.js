const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = 3450;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// controllers
const UserController = require("./controllers/users-controller");

// middleware
const middlewares = require("./middlewares/auth-middleware");

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Successfully",
  });
});

// API routes
// auth
app.post("/api/v1/register", UserController.register);
app.post("/api/v1/login", UserController.login);
app.get(
  "/api/v1/current/user",
  middlewares.authenticate,
  UserController.currentUser
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`listening on http://localhost:${PORT}`);
});
