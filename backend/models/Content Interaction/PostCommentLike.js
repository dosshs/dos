const mongoose = require("mongoose");

const PostCommentLikeSchema = new mongoose.Schema({
  postCommentId: String,
  userId: String,
  username: String,
});

module.exports = mongoose.model("PostCommentLike", PostCommentLikeSchema);
