const express = require("express");
const passport = require("passport");
const router = express.Router();
const path = require("path");

const initializePassport = require("../controllers/authController");
initializePassport(passport);

// Get Staff login page
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/staff-login.html"));
});

router.post(
  "/auth",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/staff/login",
    failureFlash: true,
  })
);

router.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
})



module.exports = router;
