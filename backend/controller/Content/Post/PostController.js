const Post = require("../../../models/Content/Post");
const AppError = require("../../../Utilities/appError");
const catchAsync = require("../../../Utilities/catchAsync");

const post_index = catchAsync(async (req, res, next) => {
  const { postId } = req.query;
  let query = {};

  // If lastPostId exists in query params, construct query to fetch posts before that ID
  if (postId && postId !== "null") {
    query._id = { $lt: postId };
  }

  // Fetch posts based on the constructed query, sorting by _id in descending order
  const posts = await Post.find(query).sort({ _id: -1 }).limit(20).lean();

  return res.status(200).json(posts);
});

const post_get = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({
    _id: req.params.id,
  });
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.status(200).json(post);
});

const post_user_get = catchAsync(async (req, res, next) => {
  const posts = await Post.find({
    username: req.query.username,
  });
  if (!posts) return res.status(404).json({ message: "Posts not found" });
  res.status(200).json(posts);
});

const post_post = catchAsync(async (req, res, next) => {
  const newPost = new Post(req.body);

  const savedPost = await newPost.save();
  res.status(200).json({ message: "Post Successfully Created", savedPost });
});

const post_update = catchAsync(async (req, res, next) => {
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id, // Update based on the document's ID
    { $set: req.body }, // New data to set
    { new: true } // Return the updated document
  );

  if (!updatedPost) {
    return res.status(404).json("Post not found");
  }
  res.status(200).json({ message: "Post Updated Successfully", updatedPost });
});

const post_delete = catchAsync(async (req, res, next) => {
  // if (req.body.userId === req.params.id || req.user.isAdmin) {
  await Post.findByIdAndDelete(req.params.id);
  res.status(200).json("Post Successfully Deleted");
  // } else {
  // return res.status(403).json("You can only delete your own account");
  // }
});

module.exports = {
  post_index,
  post_get,
  post_user_get,
  post_post,
  post_update,
  post_delete,
};
