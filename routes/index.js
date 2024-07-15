const express = require("express");
const router = express.Router();
const usermodel = require("../model/database.js");
const userController = require("../Controller/userController");
const isLogged = require("../Controller/middleware/auth");
const cloudinary_for_storage = require("../utility/cloudinary");
const multer = require("multer");
const upload = multer({ storage: cloudinary_for_storage });

// Home routes
router.get("/", userController.getHome);
router.get("/home", userController.getHome);

// Profile routes
router.get("/profile", isLogged, userController.getProfile);
router.get("/profile/upload", isLogged, userController.getUpload);
router.post(
  "/profile/upload",
  upload.single("image_upload"),
  isLogged,
  async (req, res) => {
    if (req.file) {
      const imageFilename = req.file.filename;
      const imageUrl = req.file.path;
      try {
        const userId = req.user._id;
        await usermodel.findByIdAndUpdate(
          userId,
          { $push: { uploadedImages: imageUrl } },
          { new: true }
        );
        console.log("Image uploaded and linked to the user.");
        res.redirect("/profile");
      } catch (error) {
        console.error("Error uploading image:", error);
        res.redirect("/profile");
      }
    } else {
      res.redirect("/profile");
    }
  }
);
router.post("/profile/delete", isLogged, userController.postDeleteImage);

// User authentication routes
router.get("/Sign_up/user", userController.getSignUp);
router.post("/register", userController.postRegister);
router.get("/login/user", userController.getLogin);
router.post("/login/user", userController.postLogin);
router.get("/logout", isLogged, userController.getLogout);
router.get("/delete/account", isLogged, userController.deleteAccount);

module.exports = router;
