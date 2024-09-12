const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
  },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
});

module.exports = mongoose.model("Section", SectionSchema);
