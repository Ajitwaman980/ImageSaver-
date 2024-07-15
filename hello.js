const bcrypt = require("bcrypt");
const express = require("express");
const bodyParser = require("body-parser");
const PORT = 3000;
const ejs = require("ejs");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  // res.send("this is home page ");
  // const saltRounds = 10;
  // console.log(saltRounds);
  // const password = "Admin@123";
  // console.log("this  is password ", password);
  // const salt = bcrypt.genSaltSync(saltRounds);
  // console.log(salt);
  // const hashpassword = bcrypt.hashSync(password, salt);
  // console.log("this is hashpassword ", hashpassword);
  res.render("indexme.ejs");
});
app.post("/password/user", function (req, res) {
  const password = req.body.password;
  const original_password = password;
  console.log("this is original password", original_password);
  const saltRounds = 10;
  const slt = bcrypt.genSaltSync(saltRounds);
  console.log(slt);
  const haspassword = bcrypt.hashSync(password, saltRounds);
  console.log("this is ur haspassword ", haspassword);
  try {
    if (bcrypt.compareSync(original_password, haspassword)) {
      console.log("yes this is true");
    }
  } catch (error) {
    console.log(error);
  }
  res.send(original_password);
});
app.listen(PORT, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", PORT);
});
