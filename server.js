const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const Register = require("./controllers/register");
const Signin = require("./controllers/signin");
const Profile = require("./controllers/profile");
const Image = require("./controllers/image");

// Initialisations
const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Database
const pg = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "postgres",
    database: "smartbrain"
  }
});

// Routes
app.get("/", (req, res) => res.json(database.users));
app.post("/signin", (req, res) => Signin.handleSignin(req, res, pg, bcrypt));
app.post("/register", (req, res) =>
  Register.handleRegister(req, res, pg, bcrypt)
);
app.get("/profile/:id", (req, res) => Profile.handleProfile(req, res, pg));
app.put("/image", (req, res) => Image.handleImage(req, res, pg));
app.post("/imageurl", (req, res) => Image.handleApiCall(req, res));
// Server listening
app.listen(5000, () => {
  console.info("App is running on port 5000");
});
