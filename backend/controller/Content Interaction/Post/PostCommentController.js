const PostComment = require("../../../models/Content Interaction/Post/PostComment");
const PostReply = require("../../../models/Content Interaction/Post/PostReply");
const Post = require("../../../models/Content/Post");

const commentPost = async (req, res) => {
  const {
    profilePicture,
    userId,
    fullname,
    username,
    postId,
    postCommentId,
    content,
  } = req.body;
  let comment;

  if (postId) {
    comment = new PostComment({
      profilePicture,
      userId,
      username,
      fullname,
      postId,
      content,
    });
  } else if (postCommentId) {
    comment = new PostReply({
      profilePicture,
      userId,
      username,
      fullname,
      postCommentId,
      content,
    });
  } else {
    return res.status(204).json({ message: "Comment Unidentified" });
  }

  try {
    await comment.save();

    if (postId) {
      updatedModel = await Post.findByIdAndUpdate(
        postId,
        { $push: { comments: comment._id } },
        { new: true }
      );
    } else if (postCommentId) {
      updatedModel = await PostComment.findByIdAndUpdate(
        postCommentId,
        { $push: { comments: comment._id } },
        { new: true }
      );
    }

    return res.status(200).json({
      message: "Post commented Successfully",
      comment,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const getPostComments = async (req, res) => {
  const { postId, postCommentId } = req.query;

  if (!postId && !postCommentId)
    return res.status(400).json({
      message: "Bad Request: Could not identify if Post or Post Comment",
    });

  try {
    let comments = [];
    if (postId) {
      const post = await Post.findById(postId);

      if (!post)
        return res.status(404).json({
          message: "Post does not have comments",
        });

      comments = await Promise.all(
        post.comments.map(async (id) => {
          const comment = await PostComment.findById(id);
          return comment;
        })
      );
    } else if (postCommentId) {
      const postComment = await PostComment.findById(postCommentId);

      if (!postComment)
        return res.status(404).json({
          message: "Comment does not have replies",
        });

      comments = await Promise.all(
        postComment.comments.map(async (id) => {
          const comment = await PostReply.findById(id);
          return comment;
        })
      );
    }

    return res.status(200).json({
      comments,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const getPostCommentCount = async (req, res) => {
  const { postId, postCommentId } = req.query;

  if (!postId && !postCommentId)
    return res.status(400).json({
      message: "Bad Request: Could not identify if Post or Post Comment",
    });

  try {
    let commentCount;

    if (postId) {
      const post = await Post.findById(postId);
      commentCount = post.comments.length;
    } else if (postCommentId) {
      const postComment = await PostComment.findById(postCommentId);
      commentCount = postComment.comments.length;
    }

    return res.status(200).json({
      commentCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const deleteComment = async (req, res) => {
  const { postCommentId, postReplyId } = req.query;

  try {
    let comment;
    if (postCommentId) {
      comment = await PostComment.findById(postCommentId);
      if (!comment)
        return res.status(404).json({
          message: "Post Comment not found",
        });

      await Post.findByIdAndUpdate(
        comment.postId,
        { $pull: { comments: comment._id } },
        { new: true }
      );
    } else if (postReplyId) {
      comment = await PostReply.findById(postReplyId);
      if (!comment)
        return res.status(404).json({
          message: "Post Comment not found",
        });

      await PostComment.findByIdAndUpdate(
        comment.postCommentId,
        { $pull: { comments: comment._id } },
        { new: true }
      );
    } else {
      return res.status(400).json({
        message:
          "Bad Request: Could not identify if Post Comment or Post Reply",
      });
    }

    await comment.deleteOne();

    if (comment) {
      return res.status(200).json({
        message: "Comment deleted successfully",
      });
    } else {
      return res.status(404).json({
        message: "Comment does not exist",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

module.exports = {
  commentPost,
  getPostComments,
  getPostCommentCount,
  deleteComment,
};
