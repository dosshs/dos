const User = require("../../models/User/User");
const Post = require("../models/Post");
const Announcement = require("../models/Announcement");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");

const search_get = catchAsync(async (req, res, next) => {
  const posts = await Post.find();
  return res.status(200).json(posts);
});

module.exports = {
  search_get,
  search_post,
};
