const PostComment = require("../../models/Content Interaction/PostComment");

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
      fullname,
      username,
      postId,
      content,
    });
  } else if (postCommentId) {
    comment = new PostComment({
      profilePicture,
      userId,
      fullname,
      username,
      postCommentId,
      content,
    });
  } else {
    return res.status(204).json({ message: "Comment Unidentified" });
  }

  try {
    await comment.save();

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
  if (req.query.postId) query = { postId: req.query.postId };
  else if (req.query.postCommentId)
    query = { postCommentId: req.query.postCommentId };
  else {
    return res.status(400).json({
      message: "No Post Id or Comment Id Provided",
    });
  }

  try {
    const comments = await PostComment.find(query);

    if (comments) {
      return res.status(200).json({
        comments,
      });
    } else {
      return res.status(404).json({
        message: "Post does not have comments or Post does not exist",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const getPostCommentCount = async (req, res) => {
  if (req.query.postId) query = { postId: req.query.postId };
  else if (req.query.postCommentId)
    query = { postCommentId: req.query.postCommentId };
  else {
    return res.status(400).json({
      message: "No Post Id or Comment Id Provided",
    });
  }

  try {
    const commentCount = await PostComment.countDocuments(query);

    return res.status(200).json({
      commentCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const deletedComment = await PostComment.findByIdAndDelete(commentId);

    if (deletedComment) {
      return res.status(200).json({
        message: "Comment deleted successfully",
      });
    } else {
      return res.status(404).json({
        message: "Comment does not exist",
      });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

module.exports = {
  commentPost,
  getPostComments,
  getPostCommentCount,
  deleteComment,
};
