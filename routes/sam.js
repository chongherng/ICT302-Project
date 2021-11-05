const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/:id", checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname,"../public/views/sam-dashboard.html"));
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "SAM") {
    return next();
  }
  res.status(401).send("401 - Unauthorized");
}


module.exports = router;