const mongoose = require("mongoose");

const AnnouncementCommentSchema = new mongoose.Schema({
  profilePicture: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: String,
  fullname: String,
  announcementId: { type: mongoose.Schema.Types.ObjectId, ref: "Announcement" },
  content: String,
  dateCreated: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "AnnouncementLike" }],
  comments: [
    { type: mongoose.Schema.Types.ObjectId, ref: "AnnouncementReply" },
  ],
});

module.exports = mongoose.model(
  "AnnouncementComment",
  AnnouncementCommentSchema
);
