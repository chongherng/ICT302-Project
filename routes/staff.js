const express = require("express");
const passport = require("passport");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const upload = multer({ dest: ''});

const initializePassport = require("../controllers/authController");
initializePassport(passport);

// Get Staff login page
router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("staff-login.ejs");
});

router.post("/login", upload.none(), checkNotAuthenticated, function (req, res, next) {
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
        res.redirect(req.session.returnTo || "/sam/" + user.sam_ID);
        delete req.session.returnTo;
      } else {
        res.redirect(req.session.returnTo || "/academic-staff/" + user.as_ID);
        delete req.session.returnTo;
      }
    });
  })(req, res, next);
});

router.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});


// use this middleware to make sure authenticated users are not allowed to view certain page
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    if(req.user.role === "SAM"){
      return res.redirect("/sam/" + req.user.sam_ID);
    }
    return res.redirect("/academic-staff/" + req.user.as_ID);
  }
  next();
}

module.exports = router;
