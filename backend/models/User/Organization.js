const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: true,
  },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
});

module.exports = mongoose.model("Organization", OrganizationSchema);
