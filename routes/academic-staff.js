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
  if(await validationController.validateRequestFormLink(req.params.requestNo, "Assigned Request")) {
    var request = await databaseController.getRequest(req.params.requestNo);
    res.render("assigned-requests.ejs", { staff: req.user, requestData: request})
  } else {
    res.status(410).send("The request does not exists");
  }
})

router.get("/download/upload/:filename", checkAuthenticated, async (req, res) => {
  res.download(path.join(__dirname , "../uploads/" + req.params.filename));
})

router.post("/submit", checkAuthenticated, upload.none(), async (req, res) => {
  var isValidated = await validationController.validateAssignedRequestForm(req.body);
  if (isValidated) {
    if (req.body.action == "Approve") {
      await workflowController.approveAssignedRequest(req.body, req.user);
    }
    if (req.body.action == "Reject") {
      await workflowController.rejectRequest(req.body);
    }
    if (req.body.action == "Request More Info") {
      await workflowController.requestMoreInfo(req.body);
    }
    res.redirect("/academic-staff/" + req.user.as_ID);
  } else {
    return res.sendStatus(400);
  }
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "AS") {
    return next();
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/staff/login");
  }
}

module.exports = router;
