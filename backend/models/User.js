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
    index: "text",
  },
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
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
  section: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    default: 0,
  },
  friends: {
    type: [],
    default: [],
  },
  bio: {
    type: String,
    min: 0,
    max: 200,
    index: "text",
  },
  profilePicture: String,
  isAdmin: {
    type: Boolean,
    default: false,
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
