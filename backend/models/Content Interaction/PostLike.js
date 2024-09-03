const mongoose = require("mongoose");

const PostLikeSchema = new mongoose.Schema({
  postId: String,
  userId: String,
  username: String,
});

module.exports = mongoose.model("PostLike", PostLikeSchema);
