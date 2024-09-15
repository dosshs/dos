const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  shorthand: {
    type: String,
    required: true,
  },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
});

module.exports = mongoose.model("Course", CourseSchema);
