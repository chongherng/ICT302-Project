const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/:id", checkAuthenticated, (req, res) => {
  var fullname = req.user.as_fname + " " + req.user.as_lname;
  res.render("academic-staff-dashboard.ejs", { staffName: fullname, requestData: requestList});
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "AS") {
    return next();
  }
  res.redirect("staff/login");
}

module.exports = router;
