const express = require("express");
const app = express();
const path = require("path");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const cron = require('node-cron');
const workflowController = require('./controllers/workflowController');

const home = require("./routes/home");
const request = require("./routes/request");
const staff = require("./routes/staff");
const sam = require("./routes/sam");
const academicStaff = require("./routes/academic-staff");
const passport = require("passport");

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

app.set("views", path.join(__dirname, "/public/views"));
app.use(express.static(__dirname + "/public"));

app.use("/", home);
app.use("/request", request);
app.use("/staff", staff);
app.use("/sam", sam);
app.use("/academic-staff", academicStaff);


// email notifcation scheduler
// runs every midnight 12:00 am
cron.schedule('0 0 0 * * *', () => {
  workflowController.notify48hrs();
  workflowController.notify24hrs();
}, {
  timezone: "Asia/Singapore"
});

app.listen(3000, () => console.log("Server started..."));
