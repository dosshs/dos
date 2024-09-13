const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception!!! 💣 Shutting down...");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

const port = 5555;
dotenv.config();
const app = require("./app");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to Mongoose!"));

const server = app.listen(port, async () => {
  console.log("Server Started " + port);
  console.log(process.env.NODE_ENV);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection!!! 💥 Shutting down...");

  server.close(() => {
    process.exit(1);
  });
});
