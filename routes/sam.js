const express = require("express");
const router = express.Router();
const path = require("path");
const databaseController = require('../controllers/databaseController');
const workflowController = require('../controllers/workflowController');
const validationController = require('../controllers/validationController');
const multer = require("multer");

const upload = multer({ dest: "" });

// Dashboard
router.get("/:id", checkAuthenticated, async (req, res) => {
  var requestList = await databaseController.getAllRequestWithStudent();
  res.render("sam-dashboard.ejs", { staff: req.user , requestData : requestList });
});

// New request page
router.get("/:id/request/new/:requestNo", checkAuthenticated, async (req, res) => {
  if(await validationController.validateRequestFormLink(req.params.requestNo, "New Request")){
    var request = await databaseController.getRequest(req.params.requestNo);
    var academicStaffList = await databaseController.getAllAcademicStaff();
    res.render("new-requests.ejs", { staff: req.user, requestData: request, academicStaffList: academicStaffList });
  }else {
    res.status(410).send("The request does not exists");
  }
})

// Approved request page (full view)
router.get("/:id/request/approved/:requestNo", checkAuthenticated, async (req, res) => {
  if(await validationController.validateRequestFormLink(req.params.requestNo, "Approved Request")){
    res.render("approved-requests.ejs");
  } else {
    res.status(410).send("The request does not exists");
  }
})

// Rejected request page (full view)
router.get("/:id/request/rejected/full", checkAuthenticated, async (req, res) => {
  var requestList = await databaseController.getAllRequestWithStudent(req.params.requestNo);
  res.render("rejected-requests.ejs", { staff: req.user, requestData: requestList});
})

// Rejected request page (single)
router.get("/:id/request/rejected/:requestNo", checkAuthenticated, async (req, res) => {
  if(await validationController.validateRequestFormLink(req.params.requestNo, "Rejected Request")) {
    var request = await databaseController.getRequest(req.params.requestNo);
    res.render("rejected-requests-edit.ejs", { staff: req.user, requestData: request});
  }else {
    res.status(410).send("The request does not exists");
  }
})

// Rejected request page edit
router.post("/:id/request/rejected/:requestNo/edit", checkAuthenticated, upload.none(), async (req, res) => {
  if(await validationController.validateRequestFormLink(req.params.requestNo, "Rejected Request")) {
    await workflowController.rejectedRequestReapproval(req.body, req.user);
    res.redirect("/sam/" + req.user.sam_ID);
  }else {
    res.status(410).send("The request does not exists");
  }
})


// Partial request page
router.get("/:id/request/partial/:requestNo", checkAuthenticated, async (req, res) => {
  if(await validationController.validateRequestFormLink(req.params.requestNo, "Partial Request")){
    var request = await databaseController.getRequest(req.params.requestNo, "Partial Request");
    res.render("partial-requests.ejs", { staff: req.user, requestData: request});
  } else {
    res.status(410).send("The request does not exists");
  }
  
})

// Download file
router.get("/download/upload/:filename", checkAuthenticated, async (req, res) => {
  res.download(path.join(__dirname , "../uploads/" + req.params.filename));
})

// New request page submit
router.post("/:id/request/new/:requestNo/submit", checkAuthenticated, upload.none(), async (req, res) => {
  var isValidated = await validationController.validateNewRequestForm(req.body);
  if(isValidated) {
    if(req.body.action == "Assign"){
      await workflowController.assignNewRequest(req.body, req.user);
    } 
    if(req.body.action == "Reject"){
      await workflowController.rejectRequest(req.body);
    }
    if(req.body.action == "Request More Info"){
      await workflowController.requestMoreInfo(req.body);
    }
    res.redirect("/sam/" + req.user.sam_ID);
  } else {
    return res.sendStatus(400);
  }
})

// Partial request page submit
router.post("/:id/request/partial/:requestNo/submit", checkAuthenticated, upload.none(), async (req, res) => {
  var isValidated = await validationController.validatePartialRequestForm(req.body);
  if(isValidated) {
    if(req.body.action == "Approve"){
      await workflowController.finalApprovalRequest(req.body);
    } 
    if(req.body.action == "Reject"){
      await workflowController.rejectRequest(req.body);
    }
    res.redirect("/sam/" + req.user.sam_ID);
  } else {
    return res.sendStatus(400);
  }
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "SAM") {
    return next();
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/staff/login");
  }
}

module.exports = router;