const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
  userId: String,
  username: {
    type: String,
    required: true,
    index: "text",
  },
  fullname: {
    type: String,
    required: true,
    index: "text",
  },
  content: {
    type: String,
    required: true,
    index: "text",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AnnouncementCategory",
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostLike" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostComment" }],
});

module.exports = mongoose.model("Announcement", AnnouncementSchema);
