const express = require("express");
const cors = require("cors");
const colors = require("colors");
const cookieParser = require("cookie-parser");

const dotenv = require("dotenv").config();
const postRouter = require("./routes/post.route");
const subscriberRouter = require("./routes/subscriber.route");
const sliderRouter = require("./routes/slider.route");
const programRouter = require("./routes/program.route");
const newsRouter = require("./routes/newsTicker");
const userRouter = require("./routes/user.route");
const advisorRouter = require("./routes/advisor.route");
const commonRouter = require("./routes/common.route");
const administratorRouter = require("./routes/administrator.route");
const imagesRouter = require("./routes/images.route");
const globalError = require("./middlewares/globalError.middleware");
const mongoDBConnection = require("./config/db");

//init environment variable 
const port = process.env.PORT || 5005; 

//express init
const app = express();

// cross origin problem solve
app.use(cors());

//  json type form data receive
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// static folder
app.use("/public", express.static("./public"));

/**
 * @description home route
 * @method GET
 * @route /
 * @name public
 */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "KIN API is running successfully",
  });
});

/**
 * @description  routes
 * @method GET / POST / PATCH / PUT / DELETE
 * @route /api/v1/
 * @name public
 */

// slider routes
app.use("/api/v1/slider", sliderRouter);
// post routes
app.use("/api/v1/post", postRouter);
// program routes
app.use("/api/v1/program", programRouter);
// news routes
app.use("/api/v1/news-ticker", newsRouter);
// users routes
app.use("/api/v1/users", userRouter);
// subscriber routes
app.use("/api/v1/subscriber", subscriberRouter);
// advisor routes
app.use("/api/v1/advisors", advisorRouter);
// administrator routes
app.use("/api/v1/administrator", administratorRouter);
// common routes
app.use("/api/v1/account", commonRouter);
// images routes
app.use("/api/v1/images", imagesRouter);

/**
 * @description error route
 * @method GET
 * @name public
 */ 
  
app.use("*", (req, res, next) => {
  res.status(404).json({
    status: "failed",
    message: "No route found",
  });
});

// global error middleware
app.use(globalError);

//port listen
app.listen(port, () => {
  mongoDBConnection();

  console.log(`server is running on http://localhost:${port}`.bgCyan);
});
 