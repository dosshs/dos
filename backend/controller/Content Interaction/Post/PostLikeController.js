const PostLike = require("../../../models/Content Interaction/Post/PostLike");
const Post = require("../../../models/Content/Post");
const PostComment = require("../../../models/Content Interaction/Post/PostComment");
const PostReply = require("../../../models/Content Interaction/Post/PostReply");
const AppError = require("../../../Utilities/appError");
const catchAsync = require("../../../Utilities/catchAsync");

const likePost = catchAsync(async (req, res, next) => {
  const { userId, postId, postCommentId, postReplyId } = req.body;

  // Determine the likeable item and model based on request parameters
  let likeableId, likeableModel, existingLike;
  if (postId) {
    likeableId = postId;
    likeableModel = "Post";

    existingLike = await PostLike.findOne({
      userId: userId,
      likeable: likeableId,
    });
  } else if (postCommentId) {
    likeableId = postCommentId;
    likeableModel = "PostComment";

    existingLike = await PostComment.findOne({
      userId: userId,
      likeable: likeableId,
    });
  } else if (postReplyId) {
    likeableId = postReplyId;
    likeableModel = "PostReply";

    existingLike = await PostComment.findOne({
      userId: userId,
      likeable: likeableId,
    });
  } else {
    // Handle invalid request parameters
    return res.status(400).json({ message: "Invalid request parameters" });
  }

  if (existingLike)
    return res.status(200).json({
      message: `${likeableModel} already liked`,
      existingLike,
    });

  const like = new PostLike({
    userId: userId,
    likeable: likeableId,
    likeableModel: likeableModel,
  });

  let updatedModel;
  await like.save();

  if (postId) {
    updatedModel = await Post.findByIdAndUpdate(
      likeableId,
      { $push: { likes: like._id } }, // Increment the likes field by 1
      { new: true }
    );
  } else if (postCommentId) {
    updatedModel = await PostComment.findByIdAndUpdate(
      likeableId,
      { $push: { likes: like._id } }, // Increment the likes field by 1
      { new: true }
    );
  } else if (postReplyId) {
    updatedModel = await PostReply.findByIdAndUpdate(
      likeableId,
      { $push: { likes: like._id } }, // Increment the likes field by 1
      { new: true }
    );
  }

  if (!updatedModel) {
    return res.status(404).json({ message: `${likeableModel} not found!` });
  }

  return res.status(200).json({
    message: "Post Liked Successfully",
    like,
  });
});

const getPostLikeCount = catchAsync(async (req, res, next) => {
  const { postId, postCommentId, postReplyId } = req.query;

  let postLike,
    likes = [];
  if (postId) {
    postLike = await Post.findById(postId);

    if (!postLike)
      return res.status(404).json({
        message: "Post does not have likes",
      });

    likes = await Promise.all(
      postLike.likes.map(async (id) => {
        const like = await PostLike.findById(id);
        return like;
      })
    );
  } else if (postCommentId) {
    postLike = await PostComment.findById(postCommentId);

    if (!postLike)
      return res.status(404).json({
        message: "Post Comment does not have likes",
      });

    likes = await Promise.all(
      postLike.likes.map(async (id) => {
        const like = await PostLike.findById(id);
        return like;
      })
    );
  } else if (postReplyId) {
    postLike = await PostReply.findById(postReplyId);

    if (!postLike)
      return res.status(404).json({
        message: "Post Reply not have likes",
      });

    likes = await Promise.all(
      postLike.likes.map(async (id) => {
        const like = await PostLike.findById(id);
        return like;
      })
    );
  } else
    return res.status(400).json({
      message: "Bad Request: Can't Identify Likeable",
    });

  if (!postLike)
    return res.status(404).json({
      message: "Count could not be found",
    });

  return res.status(200).json({
    likeCount: postLike.likes.length,
    likes: likes,
  });
});

const unlikePost = catchAsync(async (req, res, next) => {
  const { userId, postId, postCommentId, postReplyId } = req.query;

  let likeableId, likeableModel;
  // Determine the likeable item and model based on request parameters
  if (postId) {
    likeableId = postId;
    likeableModel = "Post";
  } else if (postCommentId) {
    likeableId = postCommentId;
    likeableModel = "PostComment";
  } else if (postReplyId) {
    likeableId = postReplyId;
    likeableModel = "PostReply";
  } else {
    // Handle invalid request parameters
    return res.status(400).json({ message: "Invalid request parameters" });
  }

  const existingLike = await PostLike.findOne({
    userId: userId,
    likeable: likeableId,
  });

  if (!existingLike) {
    return res.status(400).json({ message: "Post is not liked" });
  }

  await PostLike.findByIdAndDelete(existingLike._id);

  let updatedModel;

  if (postId) {
    updatedModel = await Post.findByIdAndUpdate(
      likeableId,
      { $pull: { likes: existingLike._id } },
      { new: true }
    );
  } else if (postCommentId) {
    updatedModel = await PostComment.findByIdAndUpdate(
      likeableId,
      { $pull: { likes: existingLike._id } },
      { new: true }
    );
  } else if (postReplyId) {
    updatedModel = await PostReply.findByIdAndUpdate(
      likeableId,
      { $pull: { likes: existingLike._id } },
      { new: true }
    );
  }

  if (!updatedModel) {
    return res.status(404).json({ message: `${likeableModel} not found!` });
  }

  return res.status(200).json({
    message: "Unliked Post successfully",
  });
});

module.exports = {
  likePost,
  getPostLikeCount,
  unlikePost,
};
