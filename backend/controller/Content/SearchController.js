const User = require("../../models/User/User");
const Post = require("../models/Post");
const Announcement = require("../models/Announcement");
const AppError = require("../../../Utilities/appError");
const catchAsync = require("../../../Utilities/catchAsync");

const search_get = catchAsync(async (req, res, next) => {
  const posts = await Post.find();
  res.status(200).json(posts);
});

const search_post = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send("user not found");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json("Wrong password");

  return res.status(200).json(user);
});

module.exports = {
  search_get,
  search_post,
};
