const mongoose = require("mongoose");

const AnnouncementCommentLikeSchema = new mongoose.Schema({
  announcementCommentId: String,
  userId: String,
  username: String,
});

module.exports = mongoose.model(
  "AnnouncementCommentLike",
  AnnouncementCommentLikeSchema
);
