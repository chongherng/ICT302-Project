const express = require("express");
const passport = require("passport");
const router = express.Router();
const path = require("path");

const initializePassport = require("../controllers/authController");
initializePassport(passport);

// Get Staff login page
router.get("/login", (req, res) => {
  res.render("staff-login.ejs");
});

router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("staff-login.ejs", { message: "Invalid Username or Password"});
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      } else if (user.role === "SAM") {
        return res.redirect("/sam/" + user.sam_ID);
      } 
      return res.redirect("/academic-staff/" + user.as_ID);
    });
  })(req, res, next);
});

router.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
