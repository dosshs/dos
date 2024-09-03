const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: String,
  usernames: String,
  content: String,
  admin: String,
  notificationType: {
    type: Number,
    enum: [0, 1, 2, 3],
    default: 0,
  },
});

module.exports = mongoose.model("Notification", NotificationSchema);
