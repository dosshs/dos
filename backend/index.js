//Libraries
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

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
// const commentRoute = require("./routes/Content/comment");
const articleRoute = require("./routes/Content/article");
const searchRoute = require("./routes/Content/search");

const aliveRoute = require("./routes/alive");

//Initialization
const app = express();
const port = 5555;
dotenv.config();

//Middlewares
app.use(express.json());
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
//Protected User route
app.use("/api/post", postRoute);
app.use("/api/announcement", auth, announcementRoute);
app.use("/api/feedback", auth, feedbackRoute);
// app.use("/api/comment", auth, commentRoute);
app.use("/api/search", auth, searchRoute);

//Others
app.use("/api/alive", aliveRoute);
app.use("/api/jwt", auth, checkAuth);

mongoose.connect(process.env.MONGO_URI);

app.listen(port, async () => {
  console.log("Server Started " + port);
});
