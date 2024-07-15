const cloudinary = require("cloudinary").v2; //import the cloudinary
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// console.log(process.env.CLOUD_NAME);
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
// console.log("working ");
const cloudinary_for_storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images_saver",
    resource_type: "auto",
  },
});
// console.log(cloudinary_for_storage);
module.exports = cloudinary_for_storage;
