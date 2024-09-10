const mongoose = require("mongoose");

const PostCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("PostCategory", PostCategorySchema);
