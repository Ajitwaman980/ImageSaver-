var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
const dataBase = require("./model/database.js");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const flash = require("connect-flash");
var app = express();
const nodeCache = require("node-cache");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// store in atlas
const store = MongoStore.create({
  mongoUrl: process.env.MongodbAtlas,
  crypto: {
    secret: process.env.SESSION_SCERT,
  },
  touchAfter: 24 * 3600, // time period in seconds
});

app.use(
  session({
    store,
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SCERT,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);
// Connect flash
app.use(flash());

// user oauth
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(dataBase.serializeUser());
passport.deserializeUser(dataBase.deserializeUser());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// this is used for retrieving images from the upload folder
app.use("/uploads", express.static("uploads"));

app.use("/", indexRouter);
// app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
