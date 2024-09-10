const mongoose = require("mongoose");

const ReportPostSchema = new mongoose.Schema({
  userId: String,
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  reportCategory: String,
  reportContent: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ReportPost", ReportPostSchema);
