const express = require("express");
const router = express.Router();
const path = require("path");
const databaseController = require('../controllers/databaseController')

router.get("/:id", checkAuthenticated, async (req, res) => {
  var fullname = req.user.as_fname + " " + req.user.as_lname;
  var requestList = await databaseController.getAllRequestWithStudentAndSAM();
  res.render("academic-staff-dashboard.ejs", { staffName: fullname, requestData: requestList});
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "AS") {
    return next();
  }
  res.redirect("staff/login");
}

module.exports = router;
