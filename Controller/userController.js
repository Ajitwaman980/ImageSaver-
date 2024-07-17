const User = require("../model/database.js");
const passport = require("passport");
const path = require("path");
const fs = require("fs");
const cloudinary_for_storage = require("../utility/cloudinary");
const multer = require("multer");
// const session = require("express-session");
const upload = multer({ storage: cloudinary_for_storage });

const session = require("express-session");
// node cacheing
const nodeCache = require("node-cache");
const { userInfo } = require("os");
const NodeCache = new nodeCache();

passport.use(User.createStrategy());

exports.getHome = (req, res) => {
  res.render("index", { success_msg: req.flash("success_msg") });
};

exports.getProfile = async (req, res) => {
  try {
    const user_id = req.user._id;
    let user_info;
    // node cacheing
    const cache_key = user_id.toString();
    if (NodeCache.has(cache_key)) {
      user_info = NodeCache.get(cache_key);
    } else {
      user_info = await User.findById(user_id);
      NodeCache.set(cache_key, user_info);
    }

    // const user_info = await User.findById(user_id);
    const { username, email, aboutYou, uploadedImages } = user_info;
    res.render("profile", {
      user_id,
      username,
      email,
      uploadedImages,
      success_msg: req.flash("success_msg"),
    });
  } catch (err) {
    // console.error("Error fetching user data:", err);
    res.redirect("/");
  }
};
// upload image get req
exports.getUpload = (req, res) => {
  const userId = req.user._id;
  return res.render("upload", { userId: userId });
};
// post req
exports.postUpload = async (req, res) => {
  if (req.file) {
    let id = req.params;
    // console.log(id);
    const imageUrl = req.file.path;
    try {
      const userId = req.user._id;
      const cache_key = userId.toString();

      let image_upload = await User.findByIdAndUpdate(
        userId,
        { $push: { uploadedImages: imageUrl } },
        { new: true }
      );

      NodeCache.del(cache_key);

      // console.log("Image uploaded and linked to the user.");
      res.redirect("/profile/u/user");
    } catch (error) {
      // console.error("Error uploading image:", error);
      res.redirect("/profile/u/user");
    }
  } else {
    res.redirect("/profile/u/user");
  }
};

exports.postDeleteImage = async (req, res) => {
  const userId = req.user._id;
  const { delete_file_name } = req.body;

  try {
    let cache_key = userId.toString();
    await User.findByIdAndUpdate(
      userId,
      { $pull: { uploadedImages: delete_file_name } },
      { new: true }
    );

    NodeCache.del(cache_key);
    // console.log("Image deleted successfully.");

    res.redirect("/profile/u/user");
  } catch (e) {
    // console.error("Error deleting image:", e);
    res.redirect("/profile/u/user");
  }
};

exports.getSignUp = (req, res) => {
  res.render("sign_in", { error: req.flash("error") });
};

exports.postRegister = (req, res) => {
  const userdata = new User({
    username: req.body.username,
    email: req.body.email,
    aboutYou: req.body.aboutYou,
    password: req.body.password,
  });

  User.register(userdata, req.body.password)
    .then(() => {
      // console.log(req.body.password);
      passport.authenticate("local")(req, res, () => {
        // req.cookie("userdata", req.body);
        req.flash("success_msg", "Account has been created successfully");
        res.redirect("/profile/u/user");
      });
    })
    .catch((error) => {
      // console.error("Error registering user:", error);
      req.flash("error", "Error registering user: " + error.message);
      res.redirect("/Sign_up/user");
    });
};

exports.getLogin = (req, res) => {
  res.render("login", { error: req.flash("error") });
};

exports.postLogin = passport.authenticate("local", {
  successRedirect: "/profile/u/user",
  failureRedirect: "/login/user",
  failureFlash: true,
});
// logout route
exports.getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
exports.deleteAccount = async (req, res) => {
  const userId = req.user._id;
  try {
    if (userId) {
      await User.findByIdAndDelete(userId);
      req.flash("success_msg", "Account has been deleted");
    }
    res.redirect("/");
  } catch (e) {
    req.flash("error", "User not found");
    res.redirect("/");
  }
};
