const mongoose = require("mongoose");

const PostReplySchema = new mongoose.Schema({
  profilePicture: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: String,
  fullname: String,
  content: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostLike" }],
  postCommentId: { type: mongoose.Schema.Types.ObjectId, ref: "PostComment" },
});

module.exports = mongoose.model("PostReply", PostReplySchema);
