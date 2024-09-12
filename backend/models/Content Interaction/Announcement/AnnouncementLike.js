const mongoose = require("mongoose");

const AnnouncementLikeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likeable: { type: mongoose.Schema.Types.ObjectId, refPath: "likeableModel" }, // Polymorphic reference
  likeableModel: {
    type: String,
    enum: ["Announcement", "AnnouncementComment", "AnnouncementReply"],
  },
  username: String,
});

module.exports = mongoose.model("AnnouncementLike", AnnouncementLikeSchema);
