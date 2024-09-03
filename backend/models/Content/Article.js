const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
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
  title: {
    type: String,
    required: true,
    index: "text",
  },
  content: {
    type: String,
    required: true,
    index: "text",
  },
  subject: {
    type: Number,
    enum: [0, 1, 2],
    default: 0,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Article", ArticleSchema);
