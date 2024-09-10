const PostLike = require("../../../models/Content Interaction/Post/PostLike");
const Post = require("../../../models/Content/Post");
const PostComment = require("../../../models/Content Interaction/Post/PostComment");
const PostReply = require("../../../models/Content Interaction/Post/PostReply");

const likePost = async (req, res) => {
  const { userId, postId, postCommentId, postReplyId } = req.body;

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

  try {
    const existingLike = await PostLike.findOne({
      userId: userId,
      likeable: likeableId,
    });

    if (existingLike)
      return res.status(200).json({
        message: "Post already liked",
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
    console.log(updatedModel);

    return res.status(200).json({
      message: "Post Liked Successfully",
      like,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const getPostLikeCount = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);

    if (!post)
      return res.status(404).json({
        message: "Post not found",
      });

    return res.status(200).json({
      likes: post.likes.length,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const unlikePost = async (req, res) => {
  const { userId, postId, postCommentId, postReplyId } = req.body;

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

  try {
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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

module.exports = {
  likePost,
  getPostLikeCount,
  unlikePost,
};
