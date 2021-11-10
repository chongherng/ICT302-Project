const express = require("express");
const router = express.Router();
const path = require("path");
const databaseController = require('../controllers/databaseController')

router.get("/:id", checkAuthenticated, async (req, res) => {
  var requestList = await databaseController.getAllRequestForAcademicStaff(req.user.as_ID);
  res.render("academic-staff-dashboard.ejs", { staff: req.user, requestData: requestList});
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "AS") {
    return next();
  }
  res.redirect("../staff/login");
}

router.get("/:id/request/assigned/:requestNo", checkAuthenticated, async (req, res) => {
  res.render("assigned-requests.ejs")
})

module.exports = router;
