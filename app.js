const express = require("express");
const app = express();
const path = require("path");

const home = require('./routes/home');
const request = require('./routes/request');

// View engine setup
app.set("view engine", "ejs");
app.use(logger); // Comment out this logger if needed

app.set("views", path.join(__dirname, "/../public/views"));
app.use(express.static("public"));

app.use('/', home);
app.use('/request', request);


function logger(req, res, next) {
    console.log("Request for " + req.originalUrl);
    next();
}

app.listen(3000, () => console.log("Server started..."));
