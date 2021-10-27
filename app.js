const express = require("express");
const app = express();
const path = require("path");
const setup = require('./setup');

const routes = require('./routes/home');

// Setup Database
    setup();

// View engine setup
app.set("view engine", "ejs");
app.use(logger);

app.set("views", path.join(__dirname, "/../public/views"));
app.use(express.static("public"));

app.use('/', routes);

function logger(req, res, next) {
    console.log("Request for " + req.originalUrl);
    next();
}

app.listen(3000, () => console.log("Server started..."));
