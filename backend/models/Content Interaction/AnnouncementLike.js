const mongoose = require("mongoose");

const AnnouncementLikeSchema = new mongoose.Schema({
  announcementId: String,
  userId: String,
  username: String,
});

module.exports = mongoose.model("AnnouncementLike", AnnouncementLikeSchema);
