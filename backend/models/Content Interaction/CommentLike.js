const mongoose = require("mongoose");

const CommentLikeSchema = new mongoose.Schema({
  commentId: String,
  userId: String,
  username: String,
});

module.exports = mongoose.model("CommentLike", CommentLikeSchema);
