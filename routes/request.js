const express = require("express");
const router = express.Router();
const path = require("path");

// Get SSS request portal
router.get("/Student-Support-Staff-Request-Portal", (req, res) => {
  res.sendFile(path.join(__dirname,"../public/views/Student-Support-Staff-Request-Portal.html"));
});

// Get Student request portal

module.exports = router;