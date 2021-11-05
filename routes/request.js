const express = require("express");
const router = express.Router();
const path = require("path");

// Get SSS request portal
router.get("/student-support-staff", (req, res) => {
  res.sendFile(path.join(__dirname,"../public/views/student-support-staff-request-portal.html"));
});

// Get Student request portal
router.get("/student", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/student-request-portal.html"));
});

module.exports = router;