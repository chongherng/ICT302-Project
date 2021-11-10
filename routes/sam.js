const express = require("express");
const router = express.Router();
const path = require("path");
const databaseController = require('../controllers/databaseController');
const workflowController = require('../controllers/workflowController');

router.get("/:id", checkAuthenticated, async (req, res) => {
  var requestList = await databaseController.getAllRequestWithStudent();
  res.render("sam-dashboard.ejs", { staff: req.user , requestData : requestList });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "SAM") {
    return next();
  }
  res.redirect("../staff/login");
}

router.get("/:id/request/new/:requestNo", checkAuthenticated, async (req, res) => {
  var request = await databaseController.getRequest(req.params.requestNo);
  var academicStaffList = await databaseController.getAllAcademicStaff();
  res.render("new-requests.ejs", { staff: req.user, requestData: request, academicStaffList: academicStaffList });
})

router.get("/:id/request/approved/:requestNo", checkAuthenticated, async (req, res) => {
  res.render("approved-requests.ejs");
})

router.get("/:id/request/rejected/:requestNo", checkAuthenticated, async (req, res) => {
  res.render("rejected-requests.ejs");
})

router.get("/:id/request/partial/:requestNo", checkAuthenticated, async (req, res) => {
  //res.render("partial-requests.ejs");
})

router.get("/download/upload/:filename", checkAuthenticated, async (req, res) => {
  res.download(path.join(__dirname , "../uploads/" + req.params.filename));
})

module.exports = router;