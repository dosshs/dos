const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  postId: String,
  userId: String,
});

module.exports = mongoose.model("Like", LikeSchema);
