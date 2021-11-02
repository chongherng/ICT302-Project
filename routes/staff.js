const express = require("express");
const router = express.Router();
const path = require("path");

const authUser = require('../controllers/authController');

// Get Staff login page
router.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/staff-login.html"));
});

router.post("/auth", async (req, res) => {
  await authUser(req, res)
})

module.exports = router;