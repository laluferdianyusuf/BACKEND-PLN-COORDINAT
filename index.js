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
const HistoryController = require("./controllers/histories-controller");

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
app.put(
  "/api/v1/change/password/:id",
  middlewares.authenticate,
  UserController.changePassword
);

// category
app.post(
  "/api/v2/generate/history/:user_id",
  middlewares.authenticate,
  HistoryController.createHistory
);
app.get(
  "/api/v2/retrieve/:user_id",
  middlewares.authenticate,
  HistoryController.getHistoryByUserId
);
app.get(
  "/api/v2/retrieve/category/:user_id",
  middlewares.authenticate,
  HistoryController.getHistoryByCategory
);
app.get(
  "/api/v2/retrieve/history/:id",
  middlewares.authenticate,
  HistoryController.getHistoryByHistoryId
);
app.delete(
  "/api/v2/destroy",
  middlewares.authenticate,
  HistoryController.deleteHistoryById
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`listening on http://localhost:${PORT}`);
});
