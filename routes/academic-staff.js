const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/:id", checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/academic-staff-dashboard.html"));
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "AS") {
    return next();
  }
  res.redirect("staff/login");
}

module.exports = router;
