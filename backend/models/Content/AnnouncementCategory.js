const mongoose = require("mongoose");

const AnnouncementCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(
  "AnnouncementCategory",
  AnnouncementCategorySchema
);
