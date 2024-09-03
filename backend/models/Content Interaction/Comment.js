const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  profilePicture: String,
  userId: String,
  username: String,
  fullname: String,
  commentId: String,
  content: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
