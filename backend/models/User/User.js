const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    min: 2,
    max: 20,
    index: "text",
  },
  lastname: {
    type: String,
    min: 2,
    max: 20,
    index: "text",
  },
  fullname: {
    type: String,
    index: "text",
  },
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
    index: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9_.-]+$/.test(v); // Ensures the username contains only letters, numbers, underscores, dots, or dashes
      },
      message: "Username contains invalid characters.",
    },
  },
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); // Simple email format validation
      },
      message: "Invalid email format.",
    },
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpiry: Date,
  emailValid: {
    type: Boolean,
    default: false,
  },
  nameValid: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friendRequestsSent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friendRequestsReceived: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  bio: {
    type: String,
    min: 0,
    max: 200,
    index: "text",
  },
  profilePicture: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  accountVerification: {
    type: Boolean,
    default: false,
  },
  dateAccountCreated: {
    type: Date,
    default: Date.now,
  },
  dateLastLoggedIn: {
    type: Date,
  },
});

module.exports = mongoose.model("User", UserSchema);
