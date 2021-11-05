const express = require("express");
const app = express();
const path = require("path");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

const home = require("./routes/home");
const request = require("./routes/request");
const staff = require("./routes/staff");
const sam = require("./routes/sam");
const academicStaff = require("./routes/academic-staff");
const passport = require("passport");

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// View engine setup
app.set("view engine", "ejs");
app.use(logger); // Comment out this logger if needed

app.set("views", path.join(__dirname, "/public/views"));
app.use(express.static("public"));

app.use("/", home);
app.use("/request", request);
app.use("/staff", staff);
app.use("/sam", sam);
app.use("/academic-staff", academicStaff);

function logger(req, res, next) {
  console.log("Request for " + req.originalUrl);
  next();
}

// use this middleware to make sure only authenticated users are allowed to view the page
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/staff/login");
}

// use this middleware to make sure authenticated users are not allowed to view certain page
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.listen(3000, () => console.log("Server started..."));
