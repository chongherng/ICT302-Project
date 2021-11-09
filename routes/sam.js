const express = require("express");
const router = express.Router();
const path = require("path");
const databaseController = require('../controllers/databaseController')

router.get("/:id", checkAuthenticated, async (req, res) => {
  var fullname = req.user.sam_fname + " " + req.user.sam_lname;
  var requestList = await databaseController.getAllRequestWithStudent();
  res.render("sam-dashboard.ejs", { staffName: fullname , requestData : requestList });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "SAM") {
    return next();
  }
  res.redirect("staff/login");
}

module.exports = router;