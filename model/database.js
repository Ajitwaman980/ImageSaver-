const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Function to connect to the database
async function mYDatabase_connected() {
  try {
    await mongoose.connect(process.env.MongodbAtlas, {});
    // console.log("Connected to MongoDB Atlas.");
  } catch (e) {
    console.log("Error connecting to MongoDB Atlas", e);
    // console.error("Failed to connect to MongoDB. Please try again.", e);
  }
}
// function connect
mYDatabase_connected();

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    aboutYou: {
      type: String,
      default: "",
    },
    uploadedImages: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Passport-Local Mongoose plugin
userSchema.plugin(plm);

// Middleware to hash password before saving the user document
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("my_data", userSchema);
