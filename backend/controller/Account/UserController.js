const User = require("../../models/User/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Announcement = require("../../models/Content/Announcement");
const AnnouncementComment = require("../../models/Content Interaction/Announcement/AnnouncementComment");
const Post = require("../../models/Content/Post");
const PostComment = require("../../models/Content Interaction/Post/PostComment");

const user_get = async (req, res) => {
  const { userId, username } = req.query;

  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const {
      email,
      emailValid,
      section,
      friends,
      accountVerification,
      dateAccountCreated,
      verificationToken,
      verificationTokenExpiry,
      password,
      isAdmin,
      __v,
      ...other
    } = user._doc;
    return res.status(200).json({ message: "User Fetched", other });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const user_index = async (req, res) => {
  try {
    const accounts = await User.find();
    res.status(200).json(accounts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const user_delete = async (req, res) => {
  // if (req.body.userId === req.params.id || req.user.isAdmin) {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json("Account Successfully Deleted");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
  // } else {
  //   return res.status(403).json("You can only delete your own account");
  // }
};

const user_update = async (req, res) => {
  const KEY = process.env.KEY;
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  if (req.body.newPassword) {
    try {
      const salt = await bcrypt.genSalt(10);

      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      //User has correct password
      if (isPasswordValid) {
        req.body.password = await bcrypt.hash(req.body.newPassword, salt);
        delete req.body.newPassword;
      } else return res.status(401).json({ message: "Incorrect Password" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error Hashing Password", err });
    }
  }

  if (req.body.firstname && req.body.lastname) {
    req.body.fullname = req.body.firstname + " " + req.body.lastname;
    req.body.nameValid = true;
  } else if (req.body.firstname) {
    req.body.fullname = req.body.firstname + " " + user.lastname;
  } else if (req.body.lastname) {
    req.body.fullname = user.firstname + " " + req.body.lastname;
  }

  if (req.body.username || req.body.fullname || req.body.profilePicture) {
    try {
      const update = {};
      if (req.body.username) update.username = req.body.username;
      if (req.body.fullname) update.fullname = req.body.fullname;
      if (req.body.profilePicture)
        update.profilePicture = req.body.profilePicture;

      //Post
      await Post.updateMany(
        { userId: userId },
        { $set: update },
        { new: true }
      );

      //Post Comment
      await PostComment.updateMany(
        { userId: userId },
        { $set: update },
        { new: true }
      );

      //Announcement
      await Announcement.updateMany(
        { userId: userId },
        { $set: update },
        { new: true }
      );

      //Announcement Comment
      await AnnouncementComment.updateMany(
        { userId: userId },
        { $set: update },
        { new: true }
      );
    } catch (err) {
      return res.status(500).json({
        message:
          "Internal Server Error, Error updating user posts, announcements, comments",
        err,
      });
    }
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not Found." });

    const expiration = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
    const payload = { user: JSON.stringify(user), exp: expiration };
    const token = jwt.sign(payload, KEY);

    return res
      .status(200)
      .json({ message: "Account Successfully Updated", token: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

module.exports = {
  user_get,
  user_index,
  user_delete,
  user_update,
};
