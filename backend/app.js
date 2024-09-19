//Libraries
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

const AppError = require("./Utilities/appError");
const globalErrorHandler = require("./controller/ErrorController");

//Routes
//Auth Controller
const auth = require("./routes/checkAuth");
const checkAuth = require("./routes/checkToken");

//Account Routes
const authRoute = require("./routes/Account/auth");
const userRoute = require("./routes/Account/user");
const verifyRoute = require("./routes/Account/verify");
const uploadRoute = require("./routes/Account/upload");
const mailRoute = require("./routes/Account/mail");
const notificationRoute = require("./routes/Account/notification");

//Content Routes
const postRoute = require("./routes/Content/post");
const announcementRoute = require("./routes/Content/announcement");
const feedbackRoute = require("./routes/Content/feedback");
const articleRoute = require("./routes/Content/article");
const searchRoute = require("./routes/Content/search");

const aliveRoute = require("./routes/alive");

//Initialization
const app = express();
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests, please try again later.",
});

//Middlewares
app.use(helmet());

//Protection Against DDOS Attack
app.use("/api", limiter);

// Body Parser
app.use(
  express.json({
    limit: "10kb",
  })
);

//Data sanization against NoSQL query injection
app.use(mongoSanitize());
app.use(hpp()); // prevent paramater pollution

app.use(cors());

//User
app.use("/api/auth", authRoute);
app.use("/api/verify", verifyRoute);
app.use("/api/mail", mailRoute);
//Protected User route
app.use("/api/user", auth, userRoute);
app.use("/api/upload", auth, uploadRoute);
app.use("/api/notification", auth, notificationRoute);

//Content
app.use("/api/article", articleRoute);
//Protected Content route
app.use("/api/post", auth, postRoute);
app.use("/api/announcement", auth, announcementRoute);
app.use("/api/feedback", auth, feedbackRoute);
app.use("/api/search", auth, searchRoute);

//Others
app.use("/api/alive", aliveRoute);
app.use("/api/jwt", auth, checkAuth);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
