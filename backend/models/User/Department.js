const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  departmentName: {
    type: String,
    required: true,
  },
  shorthand: {
    type: String,
    required: true,
  },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
});

module.exports = mongoose.model("Department", DepartmentSchema);
