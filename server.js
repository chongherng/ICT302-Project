const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.use(logger);

app.set("views", path.join(__dirname, "/../public/views"));
app.use(express.static("public"));

app.get("/",(req, res) => {
    res.sendFile(path.join(__dirname + "/public/views/index.html"));
});

app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/views/index.html"));
});

function logger(req, res, next) {
    console.log("Request for " + req.originalUrl);
    next();
}

app.listen(3000);
