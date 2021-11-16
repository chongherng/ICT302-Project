const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const validateFormController = require('../controllers/validationController');
const workFlowController = require('../controllers/workflowController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage, limits: {
  fileSize: 100000000, // 100mb file size
  fields: 5, // maximum 5 files
}, fileFilter: (req, file, cb) => {
  if(file.mimetype == 'application/msword' || file.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mimetype == 'application/pdf') {
    cb(null, true);
  }else {
    cb(null, false);
  }
} });

// Get SSS request portal
router.get("/student-support-staff", (req, res) => {
  res.render("student-support-staff-request-portal.ejs");
});

// Get Student request portal
router.get("/student", (req, res) => {
  res.render("student-request-portal.ejs");
});

router.get("/completed", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/request-completed.html"));
})

// Get SSS form data
router.post("/student-support-staff/submit", upload.single('file'), async (req, res) => {
  var isValidated = await validateFormController.validateSSSForm(req.body, req.file);
  if (isValidated) {
    try {
      var requestNo = await workFlowController.newSSSRequestToDatabase(req.body, req.file);
      await workFlowController.newRequestEmailToSAM(req.body.StudentSupportStaffID,"SSS", req.body.requestType, requestNo);
      return res.redirect("/request/completed");
    } catch {}
  }
  res.render("student-support-staff-request-portal.ejs", { message : "Student Support Staff ID does not exists"});
});

// Get Student form data
router.post("/student/submit", upload.single('file'), async (req, res) => {
  var isValidated = await validateFormController.validateStudentForm(req.body, req.file);
  if(isValidated){
    try {
      var requestNo = await workFlowController.newStudentRequestToDatabase(req.body, req.file);
      await workFlowController.newRequestEmailToSAM(req.body.StudentID,"Student", req.body.requestType, requestNo);
      return res.redirect("/request/completed");
    } catch {}
  }
  res.render("student-request-portal.ejs", { message : "Student ID does not exists"});
});

module.exports = router;