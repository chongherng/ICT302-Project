const express = require("express");
const router = express.Router();
const path = require("path");
const databaseController = require('../controllers/databaseController');
const validationController = require('../controllers/validationController');
const workflowController = require('../controllers/workflowController');
const multer = require("multer");

const upload = multer({ dest: "" });

router.get("/:id", checkAuthenticated, async (req, res) => {
  var requestList = await databaseController.getAllRequestForAcademicStaff(req.user.as_ID);
  res.render("academic-staff-dashboard.ejs", { staff: req.user, requestData: requestList});
});


router.get("/:id/request/assigned/:requestNo", checkAuthenticated, async (req, res) => {
  var request = await databaseController.getRequest(req.params.requestNo);
  res.render("assigned-requests.ejs", { staff: req.user, requestData: request})
})

router.get("/download/upload/:filename", checkAuthenticated, async (req, res) => {
  res.download(path.join(__dirname , "../uploads/" + req.params.filename));
})

router.post("/submit", checkAuthenticated, upload.none(), async (req, res) => {
  var isValidated = await validationController.validateAssignedRequestForm(req.body);
  if (isValidated) {
    console.log(req.body.action);
    if (req.body.action == "Approve") {
      workflowController.approveAssignedRequest(req.body, req.user);
    }
    if (req.body.action == "Reject") {
      workflowController.rejectRequest(req.body);
    }
    if (req.body.action == "Request More Info") {
      workflowController.requestMoreInfo(req.body);
    }
  } else {
    return res.sendStatus(400);
  }
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "AS") {
    return next();
  }
  res.redirect("../staff/login");
}

module.exports = router;
