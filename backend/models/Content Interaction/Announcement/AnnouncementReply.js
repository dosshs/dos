const mongoose = require("mongoose");

const AnnouncementReplySchema = new mongoose.Schema({
  profilePicture: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: String,
  fullname: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "AnnouncementLike" }],
  announcementId: { type: mongoose.Schema.Types.ObjectId, ref: "Announcement" },
  announcementCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AnnouncementComment",
  },
  comments: [
    { type: mongoose.Schema.Types.ObjectId, ref: "AnnouncementReply" },
  ],
  content: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AnnouncementReply", AnnouncementReplySchema);
