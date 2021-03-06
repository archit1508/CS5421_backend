const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const PORT = 4000;

const users = require("./routes/api/users.js");
const admins = require("./routes/api/admins.js");
const submission = require("./routes/api/submission.js");
const createCompetitions = require("./routes/api/createCompetitions.js");
const runQueries = require("./routes/api/runQueries.js");
const registerCompetition = require("./routes/api/registerCompetitions.js");
const questions = require("./routes/api/questions.js");
const getEvents = require('./routes/api/getApi.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//mongo connection
mongoose.connect("mongodb://127.0.0.1:27017/5421", { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);
app.use("/api/admins", admins);
app.use("/api/submission", submission);
app.use("/api/ce2", createCompetitions);
app.use("/api/ce2/", runQueries);
app.use("/api/ce2/", registerCompetition);
app.use("/api/ce2/", questions);
app.use("/api/getApi/", getEvents);

//main
app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});

app.get("/", function (req, res) {
  res.send("Hello");
});

app.get("/userRegister", function (req, res) {
  res.render("userReg");
});

app.get("/userLogin", function (req, res) {
  res.render("userLogin");
});

app.get("/userHome", function (req, res) {
  res.send("USER LOGGED IN");
});

app.get("/adminRegister", function (req, res) {
  res.render("adminReg");
});

app.get("/adminLogin", function (req, res) {
  res.render("adminLogin");
});

app.get("/adminHome", function (req, res) {
  res.send("ADMIN LOGGED IN");
});

app.get("/cee", function (req, res) {
  res.render("ce");
});
