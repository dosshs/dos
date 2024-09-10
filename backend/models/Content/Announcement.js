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
  announcementCategoryId: [
    { type: mongoose.Schema.Types.ObjectId, ref: "AnnouncementCategory" },
  ],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Announcement", AnnouncementSchema);
