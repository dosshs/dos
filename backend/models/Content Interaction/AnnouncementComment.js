const mongoose = require("mongoose");

const AnnouncementCommentSchema = new mongoose.Schema({
  profilePicture: String,
  userId: String,
  username: String,
  fullname: String,
  announcementId: String,
  announcementCommentId: String,
  content: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "AnnouncementComment",
  AnnouncementCommentSchema
);
