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
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

// Routes
app.get("/", (req, res) => res.json('App works'));
app.post("/signin", (req, res) => Signin.handleSignin(req, res, pg, bcrypt));
app.post("/register", (req, res) =>
  Register.handleRegister(req, res, pg, bcrypt)
);
app.get("/profile/:id", (req, res) => Profile.handleProfile(req, res, pg));
app.put("/image", (req, res) => Image.handleImage(req, res, pg));
app.post("/imageurl", (req, res) => Image.handleApiCall(req, res));

// Server listening
let port = process.env.PORT
if(port == null || port == ""){
  port = 8000;
}

app.listen(port, () => {
  console.info(`App is running on port ${port}`);
});
