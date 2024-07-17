const express = require("express");
const router = express.Router();
const usermodel = require("../model/database.js");
const userController = require("../Controller/userController");
const isLogged = require("../Controller/middleware/auth");
const cloudinary_for_storage = require("../utility/cloudinary");
const multer = require("multer");
const upload = multer({ storage: cloudinary_for_storage });
const nodeCache = require("node-cache");
const NodeCache = new nodeCache();

// Home routes
router.get("/", userController.getHome);
router.get("/home", userController.getHome);

// Profile routes
router.get("/profile/u/user", isLogged, userController.getProfile);
router.get("/profile/upload/:id/image", isLogged, userController.getUpload);
router.post(
  "/profile/upload/:id/image",
  upload.single("image_upload"),
  isLogged,
  userController.postUpload
);
// del image route
router.post("/profile/delete/image", isLogged, userController.postDeleteImage);

// User authentication routes
router.get("/Sign_up/user", userController.getSignUp);
router.post("/register", userController.postRegister);
router.get("/login/user", userController.getLogin);
router.post("/login/user", userController.postLogin);
router.get("/logout", isLogged, userController.getLogout);
router.get("/delete/account/:id", isLogged, userController.deleteAccount);

module.exports = router;
