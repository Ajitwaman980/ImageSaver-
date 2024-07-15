// middleware/isLogged.js
const passport = require("passport");

function isLogged(req, res, next) {
  if (req.isAuthenticated()) {
    // req.cookie("user", req.user);
    // req.flash("success", "User logged in");
    return next();
  } else {
    res.redirect("/login/user");
  }
}

module.exports = isLogged;
