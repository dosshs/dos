const mongoose = require("mongoose");

const PostCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  adminOnly: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("PostCategory", PostCategorySchema);
