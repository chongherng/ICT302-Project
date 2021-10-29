const express = require('express');
const router = express.Router();
const path = require("path");

// Get home page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/views/index.html"));
})

// Get Staff login page
router.get("/staff-login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/Staff-Login.html"));
});

module.exports = router;