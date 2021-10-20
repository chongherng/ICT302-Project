const express = require("express");
const app = express();
const path = require("path");

const routes = require('./routes/home');

// view engine setup
app.set("view engine", "ejs");
app.use(logger);

app.set("views", path.join(__dirname, "/../public/views"));
app.use(express.static("public"));

app.use('/', routes);

function logger(req, res, next) {
    console.log("Request for " + req.originalUrl);
    next();
}

app.listen(3000);
